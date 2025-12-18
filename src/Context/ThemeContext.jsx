import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getInitialThemeState = () => {
  const savedTheme = localStorage.getItem("theme");
  const savedIsSystemTheme = localStorage.getItem("isSystemTheme");

  const initialIsSystemTheme =
    savedIsSystemTheme !== null ? savedIsSystemTheme === "true" : true;

  if (savedTheme && savedTheme !== "system") {
    return {
      theme: savedTheme,
      isSystemTheme: false,
    };
  }

  return {
    theme: getSystemTheme(),
    isSystemTheme: initialIsSystemTheme,
  };
};

export const ThemeProvider = ({ children }) => {
  const initial = getInitialThemeState();
  const [theme, setTheme] = useState(initial.theme);
  const [isSystemTheme, setIsSystemTheme] = useState(initial.isSystemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!isSystemTheme) return;
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsSystemTheme(false);
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      localStorage.setItem("isSystemTheme", "false");
      return newTheme;
    });
  };

  const resetToSystem = () => {
    const newTheme = getSystemTheme();
    setIsSystemTheme(true);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("isSystemTheme", "true");
  };

  const value = {
    theme,
    toggleTheme,
    resetToSystem,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
