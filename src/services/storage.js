const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.warn("Failed to parse storage value", e);
    return fallback;
  }
};

export const loadState = (key, fallback) => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  return safeParse(raw, fallback);
};

export const saveState = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save to storage", e);
  }
};

export const removeState = (key) => {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
};
