# Testing Documentation

This document describes the manual testing process for the Personal Habit Tracker project.

## Testing Environment

```txt
Frontend: React + Vite
Backend: Go REST API
Backend Runtime: Docker Compose
Browser: Chrome / Edge
API Base URL Local: http://localhost:8080
Frontend URL Local: http://localhost:5173
Vercel Backend Route: /__/backend
Timezone: Asia/Jakarta
```

## Pre-test Setup

### 1. Start Backend Locally

```bash
docker compose up --build
```

Expected result:

```txt
Habit Tracker API running on port 8080
```

Status:

```txt
Passed
```

### 2. Start Frontend Locally

Open a second terminal:

```bash
npm run dev
```

Expected result:

```txt
Local: http://localhost:5173
```

Status:

```txt
Passed
```

### 3. Check Backend Health

Open:

```txt
http://localhost:8080/health
```

Expected result:

```json
{
  "message": "Habit Tracker API is running",
  "status": "ok"
}
```

Status:

```txt
Passed
```

## API Testing

### Test 1: Health Check

Endpoint:

```txt
GET /health
```

Expected result:

```txt
The API returns status ok and a success message.
```

Status:

```txt
Passed
```

### Test 2: Get All Habits

Endpoint:

```txt
GET /api/habits
```

URL:

```txt
http://localhost:8080/api/habits
```

Expected result:

```txt
The API returns a JSON array of habits.
Each habit contains id, name, category, time, completions, createdAt, and updatedAt.
```

Status:

```txt
Passed
```

### Test 3: Create Habit

Endpoint:

```txt
POST /api/habits
```

Request body:

```json
{
  "name": "Study SwiftUI",
  "category": "Learning",
  "time": "20:00"
}
```

Expected result:

```txt
The API creates a new habit and returns the created habit object.
The new habit includes name, category, time, completions, createdAt, and updatedAt.
```

Status:

```txt
Passed
```

### Test 4: Update Habit

Endpoint:

```txt
PUT /api/habits/{id}
```

Request body:

```json
{
  "name": "Study SwiftUI Basics",
  "category": "Learning",
  "time": "21:00"
}
```

Expected result:

```txt
The API updates the selected habit and returns the updated habit object.
The updated habit keeps its existing completion history.
```

Status:

```txt
Passed
```

### Test 5: Toggle Habit Completion

Endpoint:

```txt
POST /api/habits/{id}/toggle
```

Request body:

```json
{
  "date": "2026-06-06"
}
```

Expected result:

```txt
The API adds the date to completions if it does not exist.
The API removes the date from completions if it already exists.
```

Status:

```txt
Passed
```

### Test 6: Idempotent Completion Update

Endpoint:

```txt
PUT /api/habits/{id}/completion
```

Request body:

```json
{
  "date": "2026-06-06",
  "completed": true
}
```

Expected result:

```txt
The API marks the habit as completed for the selected date.
Sending the same request multiple times keeps the final state completed.
```

Status:

```txt
Passed
```

### Test 7: Idempotent Completion Removal

Endpoint:

```txt
PUT /api/habits/{id}/completion
```

Request body:

```json
{
  "date": "2026-06-06",
  "completed": false
}
```

Expected result:

```txt
The API removes the selected date from completions.
Sending the same request multiple times keeps the final state not completed.
```

Status:

```txt
Passed
```

### Test 8: Delete Habit

Endpoint:

```txt
DELETE /api/habits/{id}
```

Expected result:

```txt
The API deletes the selected habit and returns a success message.
The deleted habit no longer appears in GET /api/habits.
```

Status:

```txt
Passed
```

### Test 9: Invalid Habit Time

Endpoint:

```txt
POST /api/habits
```

Request body:

```json
{
  "name": "Invalid Time Habit",
  "category": "Test",
  "time": "25:99"
}
```

Expected result:

```txt
The API rejects the request and returns an error because the time must use HH:MM format.
```

Status:

```txt
Passed
```

## Frontend Testing

### Test 1: Dashboard Loads Data

Steps:

```txt
1. Start backend.
2. Start frontend.
3. Open http://localhost:5173.
```

Expected result:

```txt
Dashboard displays habit data from the backend.
The progress card and habit list are visible.
```

Status:

```txt
Passed
```

### Test 2: Add Habit

Steps:

```txt
1. Click Add Habit.
2. Fill habit name.
3. Fill category.
4. Select time.
5. Click Save Habit.
```

Expected result:

```txt
New habit appears in the habit list.
The habit is sorted based on its time.
Data remains available after refreshing the page.
```

Status:

```txt
Passed
```

### Test 3: Edit Habit

Steps:

```txt
1. Click the edit icon on a habit card.
2. Update name, category, or time.
3. Click Save Changes.
```

Expected result:

```txt
Habit card displays the updated information.
Updated data remains after refreshing the page.
If the time changes, the habit position updates based on morning-to-night sorting.
```

Status:

```txt
Passed
```

### Test 4: Delete Habit

Steps:

```txt
1. Click the delete icon on a habit card.
```

Expected result:

```txt
Habit is removed from the dashboard.
Deleted habit does not appear after refreshing the page.
```

Status:

```txt
Passed
```

### Test 5: Toggle Completion with Optimistic UI

Steps:

```txt
1. Click the completion icon on a habit card.
```

Expected result:

```txt
Habit completion status changes immediately.
Daily progress percentage updates immediately.
Animated progress graphic updates smoothly.
Backend sync completes in the background.
```

Status:

```txt
Passed
```

### Test 6: Completion Persistence

Steps:

```txt
1. Complete a habit.
2. Refresh the page.
```

Expected result:

```txt
The completed status remains consistent after the page refreshes.
```

Status:

```txt
Passed
```

### Test 7: Sort Habits by Time

Steps:

```txt
1. Add several habits with different times.
2. Refresh the page.
```

Expected result:

```txt
Habits are displayed from morning to night based on their time.
```

Status:

```txt
Passed
```

### Test 8: Empty State

Steps:

```txt
1. Delete all habits.
```

Expected result:

```txt
The app displays an empty state with a clear message and an Add First Habit button.
```

Status:

```txt
Passed
```

### Test 9: Error State

Steps:

```txt
1. Stop the backend server.
2. Keep the frontend running.
3. Refresh the frontend page.
```

Expected result:

```txt
The frontend displays an error message when the backend cannot be reached.
If cached habits exist, the app displays saved offline data.
```

Status:

```txt
Passed
```

### Test 10: Non-JSON Backend Response Handling

Steps:

```txt
1. Access the frontend while the backend route returns a non-JSON response.
2. Observe the displayed error message.
```

Expected result:

```txt
The frontend displays a clearer error message instead of crashing on JSON.parse.
```

Status:

```txt
Passed
```

## Offline-first Testing

### Test 1: Load Cached Habits

Steps:

```txt
1. Open the app while online.
2. Let the app load habits from the backend.
3. Stop the backend or disconnect the network.
4. Refresh the frontend.
```

Expected result:

```txt
The app displays cached habit data from local storage.
The app shows an offline or saved data message.
```

Status:

```txt
Passed
```

### Test 2: Offline Completion Save

Steps:

```txt
1. Open the app with existing habits loaded.
2. Disconnect the network.
3. Click the completion icon on a habit.
```

Expected result:

```txt
The habit completion status updates immediately.
The progress card updates immediately.
The app displays a message that the change was saved offline.
The action is added to the pending sync queue.
```

Status:

```txt
Passed
```

### Test 3: Offline Sync on Reconnect

Steps:

```txt
1. Complete a habit while offline.
2. Reconnect the network.
```

Expected result:

```txt
The pending offline action is synced automatically.
The app updates sync status from offline to syncing, then synced.
The backend receives the final completion state.
```

Status:

```txt
Passed
```

### Test 4: Idempotent Retry Safety

Steps:

```txt
1. Send the same completion request multiple times.
2. Check the habit completion result.
```

Expected result:

```txt
The final completion state remains correct.
Repeated sync attempts do not accidentally toggle the habit back.
```

Status:

```txt
Passed
```

## Form Validation Testing

### Test 1: Empty Habit Name

Steps:

```txt
1. Open the Add Habit form.
2. Leave Habit Name empty.
3. Submit the form.
```

Expected result:

```txt
The form prevents submission and shows a validation message.
```

Status:

```txt
Passed
```

### Test 2: Empty Category

Steps:

```txt
1. Open the Add Habit form.
2. Fill Habit Name.
3. Leave Category empty.
4. Submit the form.
```

Expected result:

```txt
The form prevents submission and shows a validation message.
```

Status:

```txt
Passed
```

### Test 3: Habit Name Character Limit

Steps:

```txt
1. Type a habit name longer than the allowed character limit.
```

Expected result:

```txt
The input prevents excessive text based on the maxLength rule.
The character counter helps the user understand the limit.
```

Status:

```txt
Passed
```

### Test 4: Category Character Limit

Steps:

```txt
1. Type a category longer than the allowed character limit.
```

Expected result:

```txt
The input prevents excessive text based on the maxLength rule.
The character counter helps the user understand the limit.
```

Status:

```txt
Passed
```

## UI and UX Testing

### Test 1: Progress Graphic

Expected result:

```txt
The progress graphic updates smoothly when a habit is completed or unchecked.
The progress percentage reflects the number of completed habits.
```

Status:

```txt
Passed
```

### Test 2: Main Action Priority

Expected result:

```txt
The completion button is visually easy to identify as the main action on each habit card.
Edit and delete actions are available but visually secondary.
```

Status:

```txt
Passed
```

### Test 3: Habit Readability

Expected result:

```txt
Habit time, category, name, streak, and completion status are readable.
The layout remains clean and understandable on desktop screen size.
```

Status:

```txt
Passed
```

### Test 4: Dashboard Hierarchy

Expected result:

```txt
The progress card gives a clear daily overview.
The habit list remains easy to scan and interact with.
The dashboard spacing feels balanced on desktop.
```

Status:

```txt
Passed
```

## Accessibility Testing

### Test 1: Form Labels

Expected result:

```txt
Habit name, category, and time inputs have visible labels.
```

Status:

```txt
Passed
```

### Test 2: Icon Button Labels

Expected result:

```txt
Completion, edit, and delete icon buttons include aria-label attributes.
```

Status:

```txt
Passed
```

### Test 3: Keyboard Interaction

Expected result:

```txt
Buttons and form inputs can be accessed using keyboard navigation.
```

Status:

```txt
Passed
```

### Test 4: Empty State Guidance

Expected result:

```txt
When there are no habits, the user receives clear guidance and a direct button to add the first habit.
```

Status:

```txt
Passed
```

## Deployment Testing

### Test 1: Frontend Build

Command:

```bash
npm run build
```

Expected result:

```txt
Vite builds the frontend successfully and generates the dist folder.
```

Status:

```txt
Passed
```

### Test 2: Vercel Environment Variables

Expected configuration:

```env
VITE_API_BASE_URL=/__/backend
VITE_APP_TIMEZONE=Asia/Jakarta
APP_TIMEZONE=Asia/Jakarta
TZ=Asia/Jakarta
DATA_FILE=/tmp/habits.json
```

Expected result:

```txt
The deployed frontend can call the backend route through /__/backend.
```

Status:

```txt
Passed
```

### Test 3: Vercel Backend Health Route

URL pattern:

```txt
https://your-project-url.vercel.app/__/backend/health
```

Expected result:

```json
{
  "message": "Habit Tracker API is running",
  "status": "ok"
}
```

Status:

```txt
Passed
```

## Final Testing Summary

```txt
Backend health check: Passed
Get habits API: Passed
Create habit API: Passed
Update habit API: Passed
Delete habit API: Passed
Toggle completion API: Passed
Idempotent completion API: Passed
Invalid time validation: Passed
Dashboard data loading: Passed
Add habit: Passed
Edit habit: Passed
Delete habit: Passed
Optimistic completion tracking: Passed
Completion persistence: Passed
Offline cached data loading: Passed
Offline completion save: Passed
Offline sync on reconnect: Passed
Progress animation: Passed
Time sorting: Passed
Empty state: Passed
Error state: Passed
Non-JSON response handling: Passed
Form validation: Passed
Basic accessibility: Passed
Frontend build: Passed
Vercel environment setup: Passed
```

## Notes

The project is ready for portfolio submission as a full-stack mini product. It demonstrates frontend component structure, custom hook architecture, backend API implementation, Docker-based backend development, REST API integration, date-based logic, scheduled habit sorting, optimistic UI updates, offline sync handling, animated UI feedback, deployment preparation, and product documentation.
