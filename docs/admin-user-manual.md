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

## 4. Logging In
1. Open the website and navigate to `/login` (or via the Admin link in the footer).
2. Enter the admin email and password.
3. If login fails, verify the email matches the approved admin email and retry.

## 5. Managing Appointments
### View Requests
1. Open Admin Dashboard and select the **Appointments** tab.
2. The tab shows a live badge with the count of pending appointments.
3. Use status filters: **All**, **Pending**, **Confirmed**, **Cancelled**.
4. Click a row to open full client intake and medical history details in the modal.

### Update Status
1. In table view or detail view, choose **Confirm** or **Cancel**.
2. The status updates immediately in the dashboard and updates the pending counter.

## 6. Managing Inquiries (Messages Tab)
1. Select the **Messages** tab on the top navigation bar.
2. The tab badge displays the count of unread inquiries.
3. Filter by **All**, **Unread**, or **Read**.
4. Click any message row to expand and read the full text. Expanding an unread message automatically marks it as read.
5. Use the quick action button to toggle read/unread status as needed.

## 7. Managing Community Impact Stories
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

## 7. How Stories Display Publicly
- Stories appear as cards on the Community Impact page.
- The first image is shown as the main card image.
- If 2–3 images are uploaded, thumbnails appear under the main image.
- Visitors can click thumbnails to switch the visible image in that card.

## 8. Common Issues and Fixes
### Cannot Log In
- Check email/password.
- Confirm you are using the configured admin email.
- Reset password in Supabase Auth if needed.

### Image Upload Fails
- Ensure image count is 3 or fewer.
- Check file type is a valid image.
- Confirm internet connection.
- Verify Supabase Storage policies are applied.

### Story Saves but Not Visible Publicly
- Confirm the story is published.
- Refresh the page and check again.

## 9. Security Best Practices
- Never share admin credentials.
- Use a strong password and change it regularly.
- Log out after using shared/public devices.

## 10. Escalation
If an issue persists, share:
- Exact action performed
- Time of issue
- Error message/screenshot
with the developer/IT support person.
