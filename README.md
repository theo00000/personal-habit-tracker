# Personal Habit Tracker

A full-stack habit tracking application that helps users build daily consistency through habit scheduling, completion tracking, progress visualization, and streak calculation.

## Overview

Personal Habit Tracker is a simple productivity app designed to help users organize daily habits from morning to night. Users can create habits, assign a time schedule, mark habits as completed for the current day, edit or delete habits, and monitor daily progress through a clean dashboard interface.

This project was built as a portfolio project to demonstrate frontend development, backend API design, RESTful communication, Docker-based local development, and product-oriented thinking.

## Problem

Many people want to build better routines, but they often lose consistency because they do not have a simple way to plan, track, and review their daily progress.

A habit tracker helps users stay aware of their routine by showing what needs to be done, when it should be done, and how much progress has been completed today.

## Target User

This application is intended for students, workers, and anyone who wants to track simple daily habits such as reading, drinking water, exercising, studying, or practicing a skill.

## My Role

Full-stack Developer.

I designed and built the frontend interface, implemented habit CRUD features, created date-based completion tracking, developed a Go REST API, added JSON-based persistence, configured Docker for local backend development, and documented the project for portfolio presentation.

## Features

- Add new habits
- Edit existing habits
- Delete habits
- Set habit schedule time
- Sort habits from morning to night
- Mark habits as completed for today
- Daily completion progress
- Animated progress graphic
- Current streak calculation
- REST API integration
- JSON file persistence
- Dockerized Go backend
- Empty state UI
- Basic accessibility support with labels and aria-labels

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Lucide React

### Backend

- Go
- net/http
- JSON file persistence

### Development Tools

- Docker
- Docker Compose
- Git
- VS Code

## Architecture

```txt
personal-habit-tracker/
├── backend/
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
│
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── HabitCard.jsx
│   │   ├── HabitForm.jsx
│   │   └── ProgressCard.jsx
│   │
│   ├── pages/
│   │   └── Dashboard.jsx
│   │
│   ├── services/
│   │   └── habitApi.js
│   │
│   ├── utils/
│   │   ├── date.js
│   │   └── streak.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

```txt
GET    /health
GET    /api/habits
POST   /api/habits
PUT    /api/habits/{id}
DELETE /api/habits/{id}
POST   /api/habits/{id}/toggle
```

## Environment Variables

Create a `.env.local` file in the root project:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TIMEZONE=Asia/Jakarta
```

## Running the Project

### 1. Run Backend with Docker

```bash
docker compose up --build
```

Backend will run at:

```txt
http://localhost:8080
```

Health check:

```txt
http://localhost:8080/health
```

### 2. Run Frontend

Open a second terminal:

```bash
npm install
npm run dev
```

Frontend will run at:

```txt
http://localhost:5173
```

## Reset Backend Data

The backend stores habit data using a Docker volume.

To reset all habit data:

```bash
docker compose down -v
docker compose up --build
```

## Challenges

The main challenge was changing the habit completion logic from a simple boolean value into a date-based completion history. This made the app more realistic because each habit stores completion dates instead of only a true or false status.

Another challenge was synchronizing the frontend and backend around date and time handling. The app uses `Asia/Jakarta` as the application timezone to keep habit completion dates consistent.

The project also required separating frontend state, reusable components, API service functions, backend route handling, and persistence logic to keep the codebase maintainable.

## What I Learned

- Building reusable React components
- Managing dashboard state in React
- Connecting React to a REST API
- Creating a REST API using Go
- Handling JSON request and response data
- Persisting data using a JSON file
- Using Docker Compose for backend development
- Sorting data based on time
- Handling date-based completion logic
- Creating portfolio-oriented documentation

## Accessibility Considerations

- Icon buttons include `aria-label`
- Form inputs use visible labels
- Buttons are keyboard accessible by default
- Text contrast is kept readable
- Empty state gives clear user guidance

## Future Improvements

- Habit detail page
- Weekly and monthly progress charts
- Category filter
- Authentication
- PostgreSQL database
- User-specific habit data
- Dark mode
- Mobile responsive polish
- Automated unit and integration tests

## Portfolio Summary

Personal Habit Tracker is a full-stack habit tracking app built with React, Go, and Docker. The app supports habit CRUD, scheduled habits, daily completion tracking, streak calculation, REST API integration, and JSON-based persistence.

## Screenshot

![Dashboard Screenshot](docs/screenshots/dashboard.png)
