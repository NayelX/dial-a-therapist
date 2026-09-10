# Admin User Manual

## 1. Purpose
This guide is for the platform administrator/therapist managing appointments, impact stories, and public-facing updates.

## 2. What You Can Do
- Sign in to the secure admin dashboard
- Manage tabs with live alert badges: **Appointments**, **Messages**, and **Impact Stories**
- Review and update appointment request statuses (Pending, Confirmed, Cancelled)
- View, expand, and mark contact inquiries as read/unread in the Messages tab
- Create, edit, and remove Community Impact stories using the interactive **FileDropzone** component
- Upload up to 3 images per impact story with instant thumbnail previews and removal actions
- Take down stories (this removes story data and linked storage images)

## 3. Before You Start
- You need a valid admin account in Supabase Auth.
- Your email must match the configured admin email in environment settings.
- Stable internet connection is required for image upload.

## 4. Logging In & Session Security
1. Open the website and navigate to `/login` (or via the Admin link in the footer).
2. If you already have an active session, you will be automatically redirected straight to `/admin`.
3. If not signed in, enter the admin email and password. Use the eye toggle icon if you need to verify password input.
4. **Session Timeout & Pre-Logout Warning**:
   - For clinical data security, the session remains active for **30 minutes** of inactivity.
   - At **28 minutes** of inactivity, a warning countdown modal appears with a 2-minute timer.
   - Click **Stay Logged In** to extend your session, or **Log Out Now** to exit immediately.
   - If the countdown reaches 0:00, the session safely ends and redirects to the homepage.

## 5. Managing Appointments
### View Requests & Filter Tabs
1. Open Admin Dashboard and select the **Appointments** tab.
2. The tab shows a live badge with the count of active pending appointments (`status === 'Pending'`).
3. Use the filter tabs: **All**, **Pending**, **Confirmed**, **Cancelled**, and **Archived**.
4. Use client name search or sort options (Date newest/oldest, Client Name A-Z/Z-A, Service Type).
5. Click a row to open full client intake, medical history, emergency contacts, and consent verification in the detail modal.

### Status Actions & Soft-Archiving
- **Confirm Appointment**: Click the green check button. Sends an email confirmation to the client.
- **Cancel Appointment**: Click the red cancel button. Opens a required cancellation reason modal. The reason is recorded and emailed to the client.
- **Soft-Archive**: For Confirmed or Cancelled appointments, click **Archive** to hide them from standard views without deleting records.
- **Unarchive / Restore**: Switch to the **Archived** tab and click **Unarchive** to restore any record back to its active state.

### Bulk Operations
1. Select individual row checkboxes or the header checkbox to select all visible filtered rows.
2. A floating bulk action bar will appear at the bottom with:
   - **Confirm All**: Updates all selected appointments and batches confirmation notifications.
   - **Cancel All**: Prompts for a single shared cancellation reason and notifies all selected clients.
   - **Archive All** / **Unarchive All**: Soft-archives or restores selected records in a single query.

## 6. Managing Inquiries (Messages Tab)
1. Select the **Messages** tab on the top navigation bar.
2. The tab badge displays the count of unread, unarchived inquiries.
3. Use the **Show unread only** toggle filter or **Mark all as read** quick action button.
4. Click any message row or chevron to expand and read the full message body inside the dedicated drawer.
5. Use the inline action button to toggle between **Mark as Read** and **Mark as Unread**.

## 7. Managing Community Impact Stories
### Alert Badge
- The **Impact Stories** tab badge displays the count of **unpublished draft stories** needing attention.

### Create a Story
1. Go to the **Impact Stories** tab.
2. Complete the grouped form sections:
   - **1. Story Content**: Title, date label, summary.
   - **2. Media**: Drag and drop or browse images using the **FileDropzone** (up to 3 images with thumbnail preview and trash/delete buttons).
   - **3. Testimonial (Optional)**: Quote and author attribution.
   - **4. Publishing & Links**: Full story URL (e.g. Facebook) and immediate publishing checkbox.
3. Click **Add Impact Story**.

### Edit a Story
1. Click **Edit** on any story in the admin list.
2. The form loads existing details and highlights the active editing state.
3. To replace images, use the FileDropzone to pick a new set (up to 3).
4. Click **Update Impact Story** or **Cancel Edit**.

### Take Down / Delete a Story
1. Click the trash icon on the story card.
2. Confirm removal:
   - Story record is deleted from Postgres.
   - Linked storage images are deleted from Supabase Storage.

## 8. Top Navigation Controls
- **View Site**: Opens the public website homepage (`/`) without ending your admin session.
- **Logout**: Immediately clears the active session and returns to the homepage.

## 9. How Stories Display Publicly
- Stories appear as cards on the Community Impact page.
- The first image is shown as the main card image.
- If 2–3 images are uploaded, thumbnails appear under the main image.
- Visitors can click thumbnails to switch the visible image in that card.

## 10. Common Issues and Fixes
### Cannot Log In
- Check email/password.
- Confirm you are using the configured admin email (`VITE_ADMIN_EMAIL`).
- Reset password in Supabase Auth if needed.

### Image Upload Fails
- Ensure image count is 3 or fewer.
- Check file type is a valid image.
- Confirm internet connection.
- Verify Supabase Storage policies are applied.

### Story Saves but Not Visible Publicly
- Confirm the story is published (`published = true`).
- Refresh the page and check again.

## 11. Security Best Practices
- Never share admin credentials.
- Use a strong password and change it regularly.
- Keep session security active; respond to the pre-logout prompt if you are still working.
- Log out after using shared or public devices.

## 10. Escalation
If an issue persists, share:
- Exact action performed
- Time of issue
- Error message/screenshot
with the developer/IT support person.
