import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
    // Specifically set on document element to ensure :root/.dark propagation optimally
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getTheme = () => theme;

  return { theme, toggleTheme, getTheme };
}
