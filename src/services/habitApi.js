const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const parseResponseBody = (text, status) => {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Backend returned non-JSON response. Status: ${status}. Response: ${text.slice(
        0,
        120,
      )}`,
    );
  }
};

const handleResponse = async (response) => {
  const text = await response.text();
  const responseBody = parseResponseBody(text, response.status);

  if (!response.ok) {
    throw new Error(responseBody.error || "Something went wrong");
  }

  return responseBody;
};

export const getHabits = async ({ signal } = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/habits`, {
    signal,
  });

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

export const setHabitCompletion = async (habitId, { date, completed }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/habits/${habitId}/completion`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, completed }),
    },
  );

  return handleResponse(response);
};
