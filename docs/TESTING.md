# Testing Documentation

This document describes the manual testing process for the Personal Habit Tracker project.

## Testing Environment

```txt
Frontend: React + Vite
Backend: Go REST API
Backend Runtime: Docker Compose
Browser: Chrome / Edge
API Base URL: http://localhost:8080
Frontend URL: http://localhost:5173
Timezone: Asia/Jakarta
```

## Pre-test Setup

### 1. Start Backend

```bash
docker compose up --build
```

Expected result:

```txt
Habit Tracker API running on port 8080
```

### 2. Start Frontend

Open a second terminal:

```bash
npm run dev
```

Expected result:

```txt
Local: http://localhost:5173
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

### Test 6: Delete Habit

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

### Test 7: Invalid Habit Time

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
If the time changes, the habit position updates based on the morning-to-night sorting.
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

### Test 5: Toggle Completion

Steps:

```txt
1. Click the completion icon on a habit card.
```

Expected result:

```txt
Habit completion status changes.
Daily progress percentage updates.
Animated progress graphic updates.
Completion status remains consistent after refreshing the page.
```

Status:

```txt
Passed
```

### Test 6: Sort Habits by Time

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

### Test 7: Empty State

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

### Test 8: Error State

Steps:

```txt
1. Stop the backend server.
2. Keep the frontend running.
3. Refresh the frontend page.
```

Expected result:

```txt
The frontend displays a Failed to fetch error message.
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

## Final Testing Summary

```txt
Backend health check: Passed
Get habits API: Passed
Create habit API: Passed
Update habit API: Passed
Delete habit API: Passed
Toggle completion API: Passed
Invalid time validation: Passed
Dashboard data loading: Passed
Add habit: Passed
Edit habit: Passed
Delete habit: Passed
Completion tracking: Passed
Progress animation: Passed
Time sorting: Passed
Empty state: Passed
Error state: Passed
Basic accessibility: Passed
```

## Notes

The project is ready for portfolio submission as a full-stack mini product. It demonstrates frontend component structure, backend API implementation, Docker-based backend development, REST API integration, date-based logic, scheduled habit sorting, animated UI feedback, and product documentation.
