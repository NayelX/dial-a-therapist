import { Appointment, ImpactStory } from "../types";
import { ADMIN_EMAIL, IMPACT_STORY_BUCKET, supabase } from "./supabase";

type ContactPayload = {
	name: string;
	email: string;
	subject: string;
	message: string;
};

type AppointmentPayload = Omit<Appointment, "id" | "status" | "createdAt">;
type ImpactStoryPayload = Omit<ImpactStory, "id" | "createdAt">;
type ImpactStoryUpdatePayload = Partial<ImpactStoryPayload>;
type ImpactStoryUpsertInput = Omit<ImpactStoryPayload, "image" | "imagePath" | "images" | "imagePaths"> & {
	imageFiles?: File[];
	image?: string;
	images?: string[];
	imagePath?: string;
	imagePaths?: string[];
};

type AppointmentDbRow = {
	id: string;
	full_name: string;
	dob: string;
	gender: string;
	address: string;
	phone: string;
	email: string;
	emergency_contact_name: string;
	emergency_contact_phone: string;
	medical_history: string;
	reason_for_visit: string;
	service_type: string;
	preferred_date: string;
	preferred_time: string;
	notes: string;
	consent: boolean;
	status: Appointment["status"];
	created_at: string;
};

type ImpactStoryDbRow = {
	id: string;
	title: string;
	image: string;
	images: string[] | null;
	image_path: string | null;
	image_paths: string[] | null;
	summary: string;
	quote: string | null;
	testimonial_author: string | null;
	date: string;
	full_story_url: string;
	published: boolean;
	created_at: string;
};

const toAppointment = (row: AppointmentDbRow): Appointment => ({
	id: row.id,
	fullName: row.full_name,
	dob: row.dob,
	gender: row.gender,
	address: row.address,
	phone: row.phone,
	email: row.email,
	emergencyContactName: row.emergency_contact_name,
	emergencyContactPhone: row.emergency_contact_phone,
	medicalHistory: row.medical_history,
	reasonForVisit: row.reason_for_visit,
	serviceType: row.service_type,
	preferredDate: row.preferred_date,
	preferredTime: row.preferred_time,
	notes: row.notes,
	consent: row.consent,
	status: row.status,
	createdAt: row.created_at,
});

const toImpactStory = (row: ImpactStoryDbRow): ImpactStory => ({
	id: row.id,
	title: row.title,
	image: row.image,
	images: row.images?.length ? row.images : [row.image],
	imagePath: row.image_path || undefined,
	imagePaths: row.image_paths?.length
		? row.image_paths
		: row.image_path
			? [row.image_path]
			: undefined,
	summary: row.summary,
	quote: row.quote || undefined,
	testimonialAuthor: row.testimonial_author || undefined,
	date: row.date,
	fullStoryUrl: row.full_story_url,
	published: row.published,
	createdAt: row.created_at,
});

const getStorageFilePathFromPublicUrl = (url?: string | null) => {
	if (!url) return null;
	const marker = `/storage/v1/object/public/${IMPACT_STORY_BUCKET}/`;
	const index = url.indexOf(marker);
	if (index === -1) return null;
	return decodeURIComponent(url.substring(index + marker.length));
};

async function uploadImpactStoryImage(file: File) {
	const extension = file.name.split(".").pop() || "jpg";
	const filePath = `impact-stories/${Date.now()}-${crypto.randomUUID()}.${extension}`;

	const { error: uploadError } = await supabase.storage
		.from(IMPACT_STORY_BUCKET)
		.upload(filePath, file, { upsert: false });

	if (uploadError) {
		throw new Error(uploadError.message);
	}

	const { data } = supabase.storage.from(IMPACT_STORY_BUCKET).getPublicUrl(filePath);

	if (!data?.publicUrl) {
		throw new Error("Could not generate image URL");
	}

	return { filePath, publicUrl: data.publicUrl };
}

const MAX_IMPACT_STORY_IMAGES = 3;

async function uploadImpactStoryImages(files: File[]) {
	if (files.length > MAX_IMPACT_STORY_IMAGES) {
		throw new Error(`You can upload up to ${MAX_IMPACT_STORY_IMAGES} images per story`);
	}

	const uploaded = await Promise.all(files.map((file) => uploadImpactStoryImage(file)));
	return {
		paths: uploaded.map((item) => item.filePath),
		urls: uploaded.map((item) => item.publicUrl),
	};
}

async function removeImpactStoryImage(filePath?: string | null, imageUrl?: string | null) {
	const resolvedPath = filePath || getStorageFilePathFromPublicUrl(imageUrl);
	if (!resolvedPath) return;

	const { error } = await supabase.storage.from(IMPACT_STORY_BUCKET).remove([resolvedPath]);
	if (error) {
		console.error(error);
	}
}

async function removeImpactStoryImages(filePaths?: (string | null)[] | null, imageUrls?: (string | null)[] | null) {
	const resolved = new Set<string>();

	(filePaths || []).forEach((path) => {
		if (path) resolved.add(path);
	});

	(imageUrls || []).forEach((url) => {
		const extracted = getStorageFilePathFromPublicUrl(url || undefined);
		if (extracted) resolved.add(extracted);
	});

	if (resolved.size === 0) return;

	const { error } = await supabase.storage.from(IMPACT_STORY_BUCKET).remove(Array.from(resolved));
	if (error) {
		console.error(error);
	}
}

async function ensureAdminSession() {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new Error("Unauthorized");
	}

	if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
		throw new Error("Forbidden");
	}

	return user;
}

export const api = {
	login: async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw new Error(error.message);

		if (ADMIN_EMAIL && data.user?.email !== ADMIN_EMAIL) {
			await supabase.auth.signOut();
			throw new Error("Unauthorized admin account");
		}

		return {
			user: {
				role: "admin",
				email: data.user?.email,
			},
		};
	},

	logout: async () => {
		await supabase.auth.signOut();
	},

	getCurrentAdmin: async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;
		if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) return null;

		return user;
	},

	createAppointment: async (payload: AppointmentPayload) => {
		const dbPayload = {
			full_name: payload.fullName,
			dob: payload.dob,
			gender: payload.gender,
			address: payload.address,
			phone: payload.phone,
			email: payload.email,
			emergency_contact_name: payload.emergencyContactName,
			emergency_contact_phone: payload.emergencyContactPhone,
			medical_history: payload.medicalHistory,
			reason_for_visit: payload.reasonForVisit,
			service_type: payload.serviceType,
			preferred_date: payload.preferredDate,
			preferred_time: payload.preferredTime,
			notes: payload.notes || "",
			consent: payload.consent,
			status: "Pending" as Appointment["status"],
		};

		const { data, error } = await supabase
			.from("appointments")
			.insert(dbPayload)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toAppointment(data as AppointmentDbRow);
	},

	createContact: async (payload: ContactPayload) => {
		const { error } = await supabase.from("contacts").insert({
			name: payload.name,
			email: payload.email,
			subject: payload.subject,
			message: payload.message,
		});

		if (error) throw new Error(error.message);
		return { message: "Message received" };
	},

	getAdminAppointments: async () => {
		await ensureAdminSession();
		const { data, error } = await supabase
			.from("appointments")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		return (data as AppointmentDbRow[]).map(toAppointment);
	},

	updateAppointmentStatus: async (id: string, status: Appointment["status"]) => {
		await ensureAdminSession();
		const { data, error } = await supabase
			.from("appointments")
			.update({ status })
			.eq("id", id)
			.select()
			.single();

		if (error) throw new Error(error.message);
		return toAppointment(data as AppointmentDbRow);
	},

	getImpactStoriesPublic: async () => {
		const { data, error } = await supabase
			.from("impact_stories")
			.select("*")
			.eq("published", true)
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		return (data as ImpactStoryDbRow[]).map(toImpactStory);
	},

	getAdminImpactStories: async () => {
		await ensureAdminSession();
		const { data, error } = await supabase
			.from("impact_stories")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		return (data as ImpactStoryDbRow[]).map(toImpactStory);
	},

	createImpactStory: async (payload: ImpactStoryUpsertInput) => {
		await ensureAdminSession();

		let uploadedImagePaths: string[] = payload.imagePaths || (payload.imagePath ? [payload.imagePath] : []);
		let uploadedImageUrls: string[] = payload.images || (payload.image ? [payload.image] : []);

		if (payload.imageFiles && payload.imageFiles.length > 0) {
			const uploaded = await uploadImpactStoryImages(payload.imageFiles);
			uploadedImagePaths = uploaded.paths;
			uploadedImageUrls = uploaded.urls;
		}

		if (uploadedImageUrls.length === 0) {
			throw new Error("Please upload at least 1 image for this story");
		}

		if (uploadedImageUrls.length > MAX_IMPACT_STORY_IMAGES) {
			throw new Error(`You can upload up to ${MAX_IMPACT_STORY_IMAGES} images per story`);
		}

		const dbPayload = {
			title: payload.title,
			image: uploadedImageUrls[0],
			images: uploadedImageUrls,
			image_path: uploadedImagePaths[0] || null,
			image_paths: uploadedImagePaths,
			summary: payload.summary,
			quote: payload.quote || null,
			testimonial_author: payload.testimonialAuthor || null,
			date: payload.date,
			full_story_url: payload.fullStoryUrl,
			published: payload.published,
		};

		const { data, error } = await supabase
			.from("impact_stories")
			.insert(dbPayload)
			.select("*")
			.single();

		if (error) throw new Error(error.message);
		return toImpactStory(data as ImpactStoryDbRow);
	},

	updateImpactStory: async (id: string, payload: ImpactStoryUpdatePayload & { imageFiles?: File[] }) => {
		await ensureAdminSession();

		const { data: existingStory, error: existingStoryError } = await supabase
			.from("impact_stories")
			.select("id, image, images, image_path, image_paths")
			.eq("id", id)
			.single();

		if (existingStoryError) throw new Error(existingStoryError.message);

		const dbPayload: Record<string, unknown> = {};

		if (payload.title !== undefined) dbPayload.title = payload.title;
		if (payload.image !== undefined) dbPayload.image = payload.image;
		if (payload.images !== undefined) dbPayload.images = payload.images;
		if (payload.summary !== undefined) dbPayload.summary = payload.summary;
		if (payload.quote !== undefined) dbPayload.quote = payload.quote || null;
		if (payload.testimonialAuthor !== undefined) dbPayload.testimonial_author = payload.testimonialAuthor || null;
		if (payload.date !== undefined) dbPayload.date = payload.date;
		if (payload.fullStoryUrl !== undefined) dbPayload.full_story_url = payload.fullStoryUrl;
		if (payload.published !== undefined) dbPayload.published = payload.published;

		if (payload.imageFiles && payload.imageFiles.length > 0) {
			const uploaded = await uploadImpactStoryImages(payload.imageFiles);
			dbPayload.image = uploaded.urls[0];
			dbPayload.images = uploaded.urls;
			dbPayload.image_path = uploaded.paths[0] || null;
			dbPayload.image_paths = uploaded.paths;
			await removeImpactStoryImages(
				existingStory.image_paths || (existingStory.image_path ? [existingStory.image_path] : []),
				existingStory.images || (existingStory.image ? [existingStory.image] : [])
			);
		}

		const { data, error } = await supabase
			.from("impact_stories")
			.update(dbPayload)
			.eq("id", id)
			.select("*")
			.single();

		if (error) throw new Error(error.message);
		return toImpactStory(data as ImpactStoryDbRow);
	},

	deleteImpactStory: async (id: string) => {
		await ensureAdminSession();

		const { data: existingStory } = await supabase
			.from("impact_stories")
			.select("id, image, images, image_path, image_paths")
			.eq("id", id)
			.single();

		const { error } = await supabase.from("impact_stories").delete().eq("id", id);
		if (error) throw new Error(error.message);

		if (existingStory) {
			await removeImpactStoryImages(
				existingStory.image_paths || (existingStory.image_path ? [existingStory.image_path] : []),
				existingStory.images || (existingStory.image ? [existingStory.image] : [])
			);
		}
	},
};

export type { AppointmentPayload, ContactPayload, ImpactStoryPayload, ImpactStoryUpdatePayload, ImpactStoryUpsertInput };
