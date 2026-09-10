# Developer / IT Manual

## 1. Audience
This document is for developers, technical maintainers, and IT operations personnel.

## 2. Architecture Overview
- Frontend: React 19 + Vite 6 + TypeScript + Tailwind CSS
- Routing: React Router v6 with `vercel.json` rewrite (`/(.*)` -> `/index.html`) for Single Page Application (SPA) routing fallback
- State & Layout: Local React state, shared motion variants (`src/lib/motion.ts`), accessible shared components (`Button`, `FileDropzone`, `SkeletonLoader`)
- Backend model: Frontend-only client app connecting to Supabase cloud services
- Data/Auth/Storage: Supabase (Postgres, Row Level Security, Auth, Storage)

## 3. Project Structure (Key Areas)
- `src/components/common/`: Shared UI components (`Button.tsx`, `FileDropzone.tsx`, `SkeletonLoader.tsx`)
- `src/components/layout/`: Global layout components (`Navbar.tsx`, `Footer.tsx`, `WhatsAppFloat.tsx`)
- `src/config/site.ts`: Centralized site contact and company details (`SITE_CONFIG`)
- `src/lib/motion.ts`: Standardized Framer Motion transitions and animation variants
- `src/pages/`: Route-level pages:
  - `Home.tsx`: Hero and core service highlights
  - `About.tsx`: Mission, vision, and clinic overview
  - `Services.tsx`: Pediatrics & Mental Health OT details with responsive image order
  - `AppointmentRequest.tsx`: 3-step client booking wizard with honeypot bot deterrence
  - `Contact.tsx`: Inquiry form with honeypot protection
  - `CommunityImpact.tsx`: Public impact stories with SkeletonLoader fallback
  - `AdminDashboard.tsx`: Tabbed admin console (Appointments, Messages, Impact Stories)
- `src/services/api.ts`: Data access layer and Supabase interactions
- `src/services/supabase.ts`: Client initialization and env-based config
- `src/types/index.ts`: Shared frontend domain types
- `vercel.json`: Vercel SPA routing rewrite configuration
- `docs/supabase-setup.sql`: DB schema, RLS policies, storage policies

## 4. Environment Setup
Required environment variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_ADMIN_EMAIL
- VITE_IMPACT_STORY_BUCKET (default impact-images)

Use .env for local secrets and keep them out of source control.

## 5. Local Development
1. Install dependencies.
2. Start dev server.
3. Run type check/lint.
4. Build for production validation.

Recommended commands:
- npm install
- npm run dev
- npm run lint
- npm run build

## 6. Supabase Provisioning
1. Create Supabase project.
2. Run docs/supabase-setup.sql in SQL editor.
3. Confirm tables:
   - appointments
   - contacts
   - impact_stories
4. Confirm RLS policies are active.
5. Confirm storage bucket exists and policies allow:
   - public read
   - admin upload/update/delete

## 7. Impact Stories (Multi-Image Behavior)
- Max 3 images per story enforced in frontend and API layer.
- DB stores:
  - image (primary URL)
  - images (URL array)
  - image_path (primary storage path)
  - image_paths (storage path array)
- UI rendering:
  - first image as main card image
  - additional images shown as clickable thumbnails

## 8. Auth and Access Model
- Admin access is based on signed-in user and configured admin email match (`VITE_ADMIN_EMAIL`).
- Admin session management:
  - Active session auto-redirects from `/login` directly to `/admin`.
  - 30-minute inactivity timer with interactive 2-minute pre-logout warning modal.
- Public users can submit forms and read published impact stories only.
- Admin-only operations:
  - Read all appointments (active + archived views)
  - Batch / single update appointment status
  - Soft-archive / restore appointments & contacts
  - Read and manage all contact messages (mark read/unread)
  - Create/update/delete impact stories
  - Upload/delete impact images

## 9. Edge Functions & Email Notifications
- **`notify-status-change`**:
  - Provider: Resend (`RESEND_API_KEY` secret).
  - Handles single notifications (`record_id: string`) and batch operations (`record_ids: string[]`).
  - Fetches records in batch with `.in('id', record_ids)` and sends via Resend's batch endpoint `/emails/batch`.

## 10. Deployment Checklist
- Environment variables set in hosting provider (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL`, `VITE_IMPACT_STORY_BUCKET`).
- Supabase Edge Function secret set: `RESEND_API_KEY`.
- Supabase SQL and policy scripts applied (including `read` and `archived` columns).
- Admin account created and tested.
- End-to-end test:
  - login / auto-redirect
  - appointment submission, status changes, and cancellation email dispatch
  - impact story create/edit/delete with image upload
- Verify production build artifacts and routing fallback for SPA.

## 10. Monitoring & Support
Track and review:
- Failed auth attempts
- Failed storage uploads/deletes
- Supabase policy denials
- Client-side runtime errors

For incident handling, capture:
- timestamp
- user email (if admin)
- action attempted
- exact error message

## 11. Handover Notes
When transferring ownership:
- Share deployment access details and environment variable locations.
- Rotate admin credentials and keys if personnel changes.
- Provide Supabase project access to the incoming maintainer.
- Deliver this docs folder plus runbook steps used in production.

## 12. Change Management Recommendation
For every feature update:
1. Update src/types first.
2. Update API mapping in src/services/api.ts.
3. Update page components.
4. Re-run lint and build.
5. Update docs/manuals in docs.
