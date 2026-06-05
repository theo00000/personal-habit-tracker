export const loadFromLocalStorage = (key, fallbackValue) => {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return fallbackValue;
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return fallbackValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }
};
