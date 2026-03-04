# Admin User Manual

## 1. Purpose
This guide is for the platform administrator/therapist managing appointments, impact stories, and public-facing updates.

## 2. What You Can Do
- Sign in to the admin dashboard
- Review and update appointment request statuses
- Create, edit, and remove Community Impact stories
- Upload up to 3 images per impact story
- Take down stories (this removes story data and linked images)

## 3. Before You Start
- You need a valid admin account in Supabase Auth.
- Your email must match the configured admin email in environment settings.
- Stable internet connection is required for image upload.

## 4. Logging In
1. Open the website.
2. Go to the login page.
3. Enter admin email and password.
4. If login fails, verify the email is the approved admin email and retry.

## 5. Managing Appointments
### View Requests
1. Open Admin Dashboard.
2. Use status filters: All, Pending, Confirmed, Cancelled.
3. Click a row to open full client details.

### Update Status
1. In table view or detail view, choose Confirm or Cancel.
2. The status updates immediately in the dashboard.

## 6. Managing Community Impact Stories
### Create a Story
1. Go to Community Impact Stories section.
2. Fill in title, date label, summary, optional quote/testimonial author, and full story URL.
3. Upload images using the file picker.
   - Minimum: 1 image
   - Maximum: 3 images
4. Choose whether to publish immediately.
5. Click Add Impact Story.

### Edit a Story
1. Click Edit on a story card in admin list.
2. Update text fields as needed.
3. To replace images, upload a new set (up to 3).
4. Click Update Impact Story.

### Take Down / Delete a Story
1. Click the take-down or delete action.
2. Confirm removal workflow (if prompted).
3. Result:
   - Story record is deleted.
   - Linked storage images are deleted.

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
