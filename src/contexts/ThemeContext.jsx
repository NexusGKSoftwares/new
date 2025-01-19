import React, { createContext, useState } from 'react';

// Create ThemeContext to manage the theme state globally
export const ThemeContext = createContext();

// ThemeProvider component to wrap around the app and provide theme state
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme set to 'light'

  // Function to toggle between light and dark modes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    // The ThemeContext.Provider makes the theme and toggleTheme accessible to all components within the provider
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} {/* Render the children components inside the provider */}
    </ThemeContext.Provider>
  );
};
