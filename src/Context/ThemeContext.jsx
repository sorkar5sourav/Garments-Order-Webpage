import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedIsSystemTheme = localStorage.getItem('isSystemTheme');

    if (savedIsSystemTheme !== null) {
      setIsSystemTheme(JSON.parse(savedIsSystemTheme));
    }

    if (savedTheme && savedTheme !== 'system') {
      setTheme(savedTheme);
      setIsSystemTheme(false);
    } else {
      // If no saved theme or 'system', use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      setIsSystemTheme(true);
    }
  }, []);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (isSystemTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };

    // Only set initial theme if not loaded from localStorage
    if (isSystemTheme) {
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsSystemTheme(false);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('isSystemTheme', 'false');
      return newTheme;
    });
  };

  const resetToSystem = () => {
    setIsSystemTheme(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const newTheme = mediaQuery.matches ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('isSystemTheme', 'true');
  };

  const value = {
    theme,
    toggleTheme,
    resetToSystem,
    isSystemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};