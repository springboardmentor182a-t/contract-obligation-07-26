import { useState, useEffect } from "react";

function readValue(key, initialValue) {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  } catch (err) {
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // ignore write errors (e.g. private browsing storage limits)
    }
  }, [key, value]);

  return [value, setValue];
}
