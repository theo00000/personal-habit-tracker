const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const getHabits = async () => {
  const response = await fetch(`${API_BASE_URL}/api/habits`);
  return handleResponse(response);
};

export const createHabit = async ({ name, category, time }) => {
  const response = await fetch(`${API_BASE_URL}/api/habits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, category, time }),
  });

  return handleResponse(response);
};

export const updateHabit = async (habitId, { name, category, time }) => {
  const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, category, time }),
  });

  return handleResponse(response);
};

export const deleteHabit = async (habitId) => {
  const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
    method: "DELETE",
  });

  return handleResponse(response);
};

export const toggleHabit = async (habitId, date) => {
  const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date }),
  });

  return handleResponse(response);
};
