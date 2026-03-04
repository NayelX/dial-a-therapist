# Developer / IT Manual

## 1. Audience
This document is for developers, technical maintainers, and IT operations personnel.

## 2. Architecture Overview
- Frontend: React + Vite + TypeScript
- Routing: React Router
- Backend model: Frontend-only app using Supabase services
- Data/Auth/Storage: Supabase (Postgres, Auth, Storage)

## 3. Project Structure (Key Areas)
- src/pages: Route-level pages
- src/services/api.ts: Data access layer and Supabase interactions
- src/services/supabase.ts: Client initialization and env-based config
- src/types/index.ts: Shared frontend domain types
- docs/supabase-setup.sql: DB schema, RLS policies, storage policies

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
- Admin access is based on signed-in user and configured admin email match.
- Public users can submit forms and read published impact stories only.
- Admin-only operations:
  - read all appointments
  - update appointment status
  - create/update/delete impact stories
  - upload/delete impact images

## 9. Deployment Checklist
- Environment variables set in hosting provider.
- Supabase SQL and policy scripts applied.
- Admin account created and tested.
- End-to-end test:
  - login
  - appointment submission and status change
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
