-- Run this in Supabase SQL Editor.
-- Replace admin email literal with your real admin account email before running policies.

create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  dob text not null,
  gender text not null,
  address text not null,
  phone text not null,
  email text not null,
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  medical_history text not null,
  reason_for_visit text not null,
  service_type text not null,
  preferred_date text not null,
  preferred_time text not null,
  notes text not null default '',
  consent boolean not null,
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.impact_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text not null,
  images text[] not null default '{}',
  image_path text,
  image_paths text[] not null default '{}',
  summary text not null,
  quote text,
  testimonial_author text,
  date text not null,
  full_story_url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.impact_stories add column if not exists image_path text;
alter table public.impact_stories add column if not exists images text[] not null default '{}';
alter table public.impact_stories add column if not exists image_paths text[] not null default '{}';
update public.impact_stories set images = case when coalesce(array_length(images, 1), 0) = 0 then array[image] else images end;
update public.impact_stories set image_paths = case when coalesce(array_length(image_paths, 1), 0) = 0 and image_path is not null then array[image_path] else image_paths end;

alter table public.appointments enable row level security;
alter table public.contacts enable row level security;
alter table public.impact_stories enable row level security;

-- Public forms can insert, but not read all records.
drop policy if exists "public_insert_appointments" on public.appointments;
create policy "public_insert_appointments"
on public.appointments
for insert
to anon, authenticated
with check (true);

drop policy if exists "public_insert_contacts" on public.contacts;
create policy "public_insert_contacts"
on public.contacts
for insert
to anon, authenticated
with check (true);

-- Admin read/update by auth email.
-- Replace the email in both policies below.
drop policy if exists "admin_select_appointments" on public.appointments;
create policy "admin_select_appointments"
on public.appointments
for select
to authenticated
using (
  --  (auth.jwt() ->> 'email') = 'asieduaasibe@gmail.com' );
 (auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

drop policy if exists "admin_update_appointments" on public.appointments;
create policy "admin_update_appointments"
on public.appointments
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

drop policy if exists "public_select_published_impact_stories" on public.impact_stories;
create policy "public_select_published_impact_stories"
on public.impact_stories
for select
to anon, authenticated
using (published = true);

drop policy if exists "admin_select_impact_stories" on public.impact_stories;
create policy "admin_select_impact_stories"
on public.impact_stories
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

drop policy if exists "admin_insert_impact_stories" on public.impact_stories;
create policy "admin_insert_impact_stories"
on public.impact_stories
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

drop policy if exists "admin_update_impact_stories" on public.impact_stories;
create policy "admin_update_impact_stories"
on public.impact_stories
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

drop policy if exists "admin_delete_impact_stories" on public.impact_stories;
create policy "admin_delete_impact_stories"
on public.impact_stories
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com');

-- Storage for impact story images
insert into storage.buckets (id, name, public)
select 'impact-images', 'impact-images', true
where not exists (
  select 1 from storage.buckets where id = 'impact-images'
);

drop policy if exists "public_read_impact_images" on storage.objects;
create policy "public_read_impact_images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'impact-images');

drop policy if exists "admin_upload_impact_images" on storage.objects;
create policy "admin_upload_impact_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'impact-images'
  and (auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com'
);

drop policy if exists "admin_update_impact_images" on storage.objects;
create policy "admin_update_impact_images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'impact-images'
  and (auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com'
)
with check (
  bucket_id = 'impact-images'
  and (auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com'
);

drop policy if exists "admin_delete_impact_images" on storage.objects;
create policy "admin_delete_impact_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'impact-images'
  and (auth.jwt() ->> 'email') = 'ayelgumhandson001@gmail.com'
);
