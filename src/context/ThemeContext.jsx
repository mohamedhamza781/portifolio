import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return context;
};

// Dark mode + the toggle button were removed from the UI, so the site is
// permanently locked to light mode now — no localStorage lookup, no
// system-preference detection, nothing that could switch it to dark again.
export const ThemeModeProvider = ({ children }) => {
  const mode = 'light';
  const theme = useMemo(() => createAppTheme(mode), []);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode: () => {} }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};