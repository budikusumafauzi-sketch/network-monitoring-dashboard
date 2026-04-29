import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    document.body.className = theme + '-mode'; // Add 'light-mode' or 'dark-mode' class to body
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};

export default useDarkMode;
