import { create } from "zustand";

export const useThemeStore = create((set) => {
  // Initialize theme from localStorage or default to "coffee"
  const initialTheme = localStorage.getItem("theme") || "coffee";

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      localStorage.setItem("theme", theme); // Save theme to localStorage
      set({ theme }); // Update zustand store
    }
  };
});
