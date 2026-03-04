# Dial-A-Therapist Ghana

Your care is our care.

Dial-A-Therapist Ghana is a modern healthcare web platform for occupational therapy services, appointment intake, and community impact communication.

## Overview

This project provides:

- Public pages for services, about, contact, and impact
- End-to-end appointment request intake
- Admin dashboard for appointment management
- Community Impact story management with image uploads
- Supabase-powered auth, database, and storage
- Responsive UI in a Black and Gold brand style

## Current Tech Stack

- React 19
- Vite 6
- TypeScript
- React Router
- Tailwind CSS
- Motion + Lucide icons
- Supabase (Auth, Postgres, Storage)

## Core Features

### Public Experience
- Home, About, Services, Contact, Community Impact
- Appointment request form with full intake fields
- WhatsApp quick contact integration
- Custom 404 page

### Admin Experience
- Secure admin login via Supabase Auth
- Appointment table with status updates (Pending, Confirmed, Cancelled)
- Detailed appointment modal for full intake review
- Impact story create, edit, and delete workflow

### Community Impact Stories
- Admin can upload 1 to 3 images per story
- Public cards show a main image plus thumbnail previews
- Clicking thumbnails switches the visible card image
- Story deletion removes both record and linked storage objects

## Data and Security Model

- Supabase Postgres is the system of record
- Row Level Security policies control access by role and email
- Public users can submit forms and read published impact stories
- Admin users can manage appointments and impact stories
- Supabase Storage bucket serves impact story images

## Project Structure

```text
.
├── docs/
│   ├── admin-user-manual.md
│   ├── developer-it-manual.md
│   ├── visitor-user-manual.md
│   └── supabase-setup.sql
├── public/
├── src/
│   ├── pages/
│   ├── services/
│   └── types/
├── .env.example
├── package.json
└── readme.md
```

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file based on `.env.example`.

Required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL`
- `VITE_SUPABASE_IMPACT_BUCKET` (default: `impact-images`)

### 3) Configure Supabase

Run the SQL setup script in your Supabase SQL Editor:

- `docs/supabase-setup.sql`

This creates tables, enables RLS, and configures storage policies used by the app.

### 4) Start development server

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Scripts

- `npm run dev` – start local development server
- `npm run lint` – run TypeScript type checks
- `npm run build` – build production bundle
- `npm run preview` – preview production build locally

## Admin Operations Quick Guide

1. Log in with configured admin account.
2. Review and update incoming appointments.
3. Add impact stories with up to 3 images.
4. Edit or delete stories as needed.

Detailed role manuals:

- `docs/admin-user-manual.md`
- `docs/visitor-user-manual.md`
- `docs/developer-it-manual.md`

## Deployment Notes

- Deploy as a static frontend application (Vite build output)
- Ensure environment variables are set in your host
- Ensure Supabase policies and storage bucket are configured before go-live
- Validate admin login and image upload flows after deployment

## Known Notes

- This is not a medical records platform and is not HIPAA-certified.
- Payment processing is not included.
- Access control currently centers on configured admin email policy.

## Contact

For organizational inquiries:

- Email: info@dialatherapistgh.com
- WhatsApp: available via floating button in the app

---

Dial-A-Therapist Ghana
*Your care is our care.*

