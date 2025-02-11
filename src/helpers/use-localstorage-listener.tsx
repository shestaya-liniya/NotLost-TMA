import { useState, useEffect } from "react";

export const useLocalStorageListener = (key: string) => {
  const [value, setValue] = useState(localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue);
      }
    };

    const handleManualChange = () => {
      setValue(localStorage.getItem(key));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleManualChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleManualChange);
    };
  }, [key]);

  const updateValue = (newValue: string) => {
    localStorage.setItem(key, newValue);
    window.dispatchEvent(new Event("localStorageChange"));
  };

  return [value, updateValue] as const;
};

// To use outside of react
export const updateLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event("localStorageChange"));
};
