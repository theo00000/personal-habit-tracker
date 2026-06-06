package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Habit struct {
	ID          int64    `json:"id"`
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	Time        string   `json:"time"`
	Completions []string `json:"completions"`
	CreatedAt   string   `json:"createdAt"`
	UpdatedAt   string   `json:"updatedAt"`
}

type HabitInput struct {
	Name     string `json:"name"`
	Category string `json:"category"`
	Time     string `json:"time"`
}

type ToggleInput struct {
	Date string `json:"date"`
}

type CompletionInput struct {
	Date      string `json:"date"`
	Completed bool   `json:"completed"`
}

type Store struct {
	mu       sync.Mutex
	filePath string
	habits   []Habit
}

func main() {
	port := getEnv("PORT", "8080")
	dataFile := getEnv("DATA_FILE", "./data/habits.json")

	store := &Store{
		filePath: dataFile,
		habits:   []Habit{},
	}

	if err := store.Load(); err != nil {
		log.Fatalf("failed to load store: %v", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/habits", store.habitsHandler)
	mux.HandleFunc("/api/habits/", store.habitByIDHandler)

	log.Printf("Habit Tracker API running on port %s", port)

	err := http.ListenAndServe(":"+port, corsMiddleware(mux))
	if err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"message": "Habit Tracker API is running",
	})
}

func (s *Store) habitsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.getHabits(w, r)
	case http.MethodPost:
		s.createHabit(w, r)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Store) habitByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, action, err := parseHabitPath(r.URL.Path)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if action == "toggle" {
		if r.Method != http.MethodPost {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		s.toggleHabit(w, r, id)
		return
	}

	if action == "completion" {
		if r.Method != http.MethodPut {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
			return
		}

		s.setHabitCompletion(w, r, id)
		return
	}

	switch r.Method {
	case http.MethodPut:
		s.updateHabit(w, r, id)
	case http.MethodDelete:
		s.deleteHabit(w, r, id)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Store) getHabits(w http.ResponseWriter, _ *http.Request) {
	s.mu.Lock()
	defer s.mu.Unlock()

	habits := make([]Habit, len(s.habits))
	copy(habits, s.habits)

	sort.Slice(habits, func(i, j int) bool {
		return normalizeHabitTime(habits[i].Time) < normalizeHabitTime(habits[j].Time)
	})

	writeJSON(w, http.StatusOK, habits)
}

func (s *Store) createHabit(w http.ResponseWriter, r *http.Request) {
	var input HabitInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	name := strings.TrimSpace(input.Name)
	category := strings.TrimSpace(input.Category)
	habitTime := strings.TrimSpace(input.Time)

	if habitTime == "" {
		habitTime = "09:00"
	}

	if name == "" || category == "" {
		writeError(w, http.StatusBadRequest, "name and category are required")
		return
	}

	if !isValidHabitTime(habitTime) {
		writeError(w, http.StatusBadRequest, "time must use HH:MM format")
		return
	}

	now := appNow().Format(time.RFC3339)

	newHabit := Habit{
		ID:          appNow().UnixMilli(),
		Name:        name,
		Category:    category,
		Time:        habitTime,
		Completions: []string{},
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	s.mu.Lock()
	s.habits = append([]Habit{newHabit}, s.habits...)
	err := s.SaveLocked()
	s.mu.Unlock()

	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save habit")
		return
	}

	writeJSON(w, http.StatusCreated, newHabit)
}

func (s *Store) updateHabit(w http.ResponseWriter, r *http.Request, id int64) {
	var input HabitInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	name := strings.TrimSpace(input.Name)
	category := strings.TrimSpace(input.Category)
	habitTime := strings.TrimSpace(input.Time)

	if habitTime == "" {
		habitTime = "09:00"
	}

	if name == "" || category == "" {
		writeError(w, http.StatusBadRequest, "name and category are required")
		return
	}

	if !isValidHabitTime(habitTime) {
		writeError(w, http.StatusBadRequest, "time must use HH:MM format")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	for index, habit := range s.habits {
		if habit.ID == id {
			s.habits[index].Name = name
			s.habits[index].Category = category
			s.habits[index].Time = habitTime
			s.habits[index].UpdatedAt = appNow().Format(time.RFC3339)

			if err := s.SaveLocked(); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to save habit")
				return
			}

			writeJSON(w, http.StatusOK, s.habits[index])
			return
		}
	}

	writeError(w, http.StatusNotFound, "habit not found")
}

func (s *Store) deleteHabit(w http.ResponseWriter, _ *http.Request, id int64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for index, habit := range s.habits {
		if habit.ID == id {
			s.habits = append(s.habits[:index], s.habits[index+1:]...)

			if err := s.SaveLocked(); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to save habit")
				return
			}

			writeJSON(w, http.StatusOK, map[string]string{
				"message": "habit deleted successfully",
			})
			return
		}
	}

	writeError(w, http.StatusNotFound, "habit not found")
}

func (s *Store) toggleHabit(w http.ResponseWriter, r *http.Request, id int64) {
	var input ToggleInput

	_ = json.NewDecoder(r.Body).Decode(&input)

	date := strings.TrimSpace(input.Date)

	if date == "" {
		date = appNow().Format("2006-01-02")
	}

	if !isValidDate(date) {
		writeError(w, http.StatusBadRequest, "date must use YYYY-MM-DD format")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	for habitIndex, habit := range s.habits {
		if habit.ID == id {
			completions := habit.Completions
			isCompleted := containsDate(completions, date)

			if isCompleted {
				completions = removeDate(completions, date)
			} else {
				completions = append(completions, date)
				sort.Strings(completions)
			}

			s.habits[habitIndex].Completions = completions
			s.habits[habitIndex].UpdatedAt = appNow().Format(time.RFC3339)

			if err := s.SaveLocked(); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to save habit")
				return
			}

			writeJSON(w, http.StatusOK, s.habits[habitIndex])
			return
		}
	}

	writeError(w, http.StatusNotFound, "habit not found")
}

func (s *Store) setHabitCompletion(w http.ResponseWriter, r *http.Request, id int64) {
	var input CompletionInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	date := strings.TrimSpace(input.Date)

	if date == "" {
		date = appNow().Format("2006-01-02")
	}

	if !isValidDate(date) {
		writeError(w, http.StatusBadRequest, "date must use YYYY-MM-DD format")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	for habitIndex, habit := range s.habits {
		if habit.ID == id {
			completions := habit.Completions
			isCompleted := containsDate(completions, date)

			if input.Completed && !isCompleted {
				completions = append(completions, date)
				sort.Strings(completions)
			}

			if !input.Completed && isCompleted {
				completions = removeDate(completions, date)
			}

			s.habits[habitIndex].Completions = completions
			s.habits[habitIndex].UpdatedAt = appNow().Format(time.RFC3339)

			if err := s.SaveLocked(); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to save habit")
				return
			}

			writeJSON(w, http.StatusOK, s.habits[habitIndex])
			return
		}
	}

	writeError(w, http.StatusNotFound, "habit not found")
}

func (s *Store) Load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if err := os.MkdirAll(filepath.Dir(s.filePath), 0755); err != nil {
		return err
	}

	file, err := os.ReadFile(s.filePath)

	if errors.Is(err, os.ErrNotExist) {
		s.habits = seedHabits()
		return s.SaveLocked()
	}

	if err != nil {
		return err
	}

	if len(file) == 0 {
		s.habits = seedHabits()
		return s.SaveLocked()
	}

	if err := json.Unmarshal(file, &s.habits); err != nil {
		return err
	}

	for index := range s.habits {
		if s.habits[index].Time == "" {
			s.habits[index].Time = "09:00"
		}
	}

	return nil
}

func (s *Store) SaveLocked() error {
	data, err := json.MarshalIndent(s.habits, "", "  ")
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(s.filePath), 0755); err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}

func seedHabits() []Habit {
	now := appNow()
	today := now.Format("2006-01-02")
	yesterday := now.AddDate(0, 0, -1).Format("2006-01-02")
	twoDaysAgo := now.AddDate(0, 0, -2).Format("2006-01-02")
	timestamp := now.Format(time.RFC3339)

	return []Habit{
		{
			ID:          1,
			Name:        "Workout 20 minutes",
			Category:    "Fitness",
			Time:        "06:30",
			Completions: []string{},
			CreatedAt:   timestamp,
			UpdatedAt:   timestamp,
		},
		{
			ID:          2,
			Name:        "Drink 2L water",
			Category:    "Health",
			Time:        "08:00",
			Completions: []string{yesterday, today},
			CreatedAt:   timestamp,
			UpdatedAt:   timestamp,
		},
		{
			ID:          3,
			Name:        "Read 10 pages",
			Category:    "Learning",
			Time:        "19:30",
			Completions: []string{twoDaysAgo, yesterday, today},
			CreatedAt:   timestamp,
			UpdatedAt:   timestamp,
		},
	}
}

func parseHabitPath(path string) (int64, string, error) {
	trimmed := strings.TrimPrefix(path, "/api/habits/")
	parts := strings.Split(strings.Trim(trimmed, "/"), "/")

	if len(parts) == 0 || parts[0] == "" {
		return 0, "", errors.New("habit id is required")
	}

	id, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return 0, "", errors.New("invalid habit id")
	}

	action := ""

	if len(parts) > 1 {
		action = parts[1]
	}

	return id, action, nil
}

func containsDate(dates []string, target string) bool {
	for _, date := range dates {
		if date == target {
			return true
		}
	}

	return false
}

func removeDate(dates []string, target string) []string {
	result := []string{}

	for _, date := range dates {
		if date != target {
			result = append(result, date)
		}
	}

	return result
}

func isValidDate(value string) bool {
	_, err := time.Parse("2006-01-02", value)
	return err == nil
}

func isValidHabitTime(value string) bool {
	_, err := time.Parse("15:04", value)
	return err == nil
}

func normalizeHabitTime(value string) string {
	if !isValidHabitTime(value) {
		return "09:00"
	}

	return value
}

func appNow() time.Time {
	locationName := getEnv("APP_TIMEZONE", "Asia/Jakarta")

	location, err := time.LoadLocation(locationName)
	if err != nil {
		return time.Now()
	}

	return time.Now().In(location)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("failed to write JSON response: %v", err)
	}
}

func writeError(w http.ResponseWriter, statusCode int, message string) {
	writeJSON(w, statusCode, map[string]string{
		"error": message,
	})
}

func getEnv(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))

	if value == "" {
		return fallback
	}

	return value
}