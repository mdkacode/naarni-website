// Theme Context for managing light/dark mode
import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  // Track if user has manually set a theme preference
  const [hasManualPreference, setHasManualPreference] = useState(() => {
    return !!localStorage.getItem("theme");
  });

  // Apply theme to DOM - use both useLayoutEffect and useEffect for maximum compatibility
  const applyThemeToDOM = useCallback(() => {
    const root = document.documentElement;
    
    // Remove dark class first to ensure clean state
    root.classList.remove("dark");
    
    // Add dark class only if theme is dark
    if (theme === "dark") {
      root.classList.add("dark");
    }
  }, [theme]);

  // Use useLayoutEffect to apply theme synchronously before paint
  useLayoutEffect(() => {
    applyThemeToDOM();
    
    // Save to localStorage when user has manually set preference
    if (hasManualPreference) {
      localStorage.setItem("theme", theme);
    } else {
      // Clear localStorage if following system theme
      localStorage.removeItem("theme");
    }
  }, [theme, hasManualPreference, applyThemeToDOM]);

  // Also apply in useEffect as a fallback to ensure it happens
  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  // Listen to system theme changes when no manual preference is set
  useEffect(() => {
    if (hasManualPreference) {
      return; // Don't listen if user has manually set preference
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches || (e as MediaQueryListEvent).matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      // Force immediate DOM update for system theme changes
      requestAnimationFrame(() => {
        const root = document.documentElement;
        root.classList.remove("dark");
        if (newTheme === "dark") {
          root.classList.add("dark");
        }
      });
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
      return () => {
        mediaQuery.removeListener(handleSystemThemeChange);
      };
    }
  }, [hasManualPreference]);

  const toggleTheme = () => {
    setHasManualPreference(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Force immediate DOM update for button clicks
    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.classList.remove("dark");
      if (newTheme === "dark") {
        root.classList.add("dark");
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

