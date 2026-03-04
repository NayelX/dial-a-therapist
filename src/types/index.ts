export interface Appointment {
  id: string;
  // Personal Details
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Medical Info
  medicalHistory: string;
  reasonForVisit: string;
  // Appointment Details
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  // Status & Metadata
  consent: boolean;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export type ServiceCategory = 'Pediatrics' | 'Mental Health';

export interface ImpactStory {
  id: string;
  title: string;
  image: string;
  images?: string[];
  imagePath?: string;
  imagePaths?: string[];
  summary: string;
  quote?: string;
  testimonialAuthor?: string;
  date: string;
  fullStoryUrl: string;
  published: boolean;
  createdAt: string;
}
