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

### Test 1: Get All Habits

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

### Test 2: Create Habit

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
```

Status:

```txt
Passed
```

### Test 3: Update Habit

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
```

Status:

```txt
Passed
```

### Test 4: Toggle Habit Completion

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

### Test 5: Delete Habit

Endpoint:

```txt
DELETE /api/habits/{id}
```

Expected result:

```txt
The API deletes the selected habit and returns a success message.
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
Progress card updates if needed.
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

## Final Testing Summary

```txt
Backend health check: Passed
Get habits API: Passed
Create habit API: Passed
Update habit API: Passed
Delete habit API: Passed
Toggle completion API: Passed
Dashboard data loading: Passed
Add habit: Passed
Edit habit: Passed
Delete habit: Passed
Completion tracking: Passed
Progress animation: Passed
Time sorting: Passed
Empty state: Passed
Basic accessibility: Passed
```

## Notes

The project is ready for portfolio submission as a full-stack mini product. It demonstrates frontend component structure, backend API implementation, Docker-based local development, REST API integration, date-based logic, and product documentation.
