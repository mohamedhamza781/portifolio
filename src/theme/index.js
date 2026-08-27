import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1A1A1A', light: '#3D3D3D', dark: '#000000', contrastText: '#FFFFFF' },
          // أزرق ملكي مشع وعميق للوضع المضيء
          secondary: { main: '#0052FF', light: '#3375FF', dark: '#003DB3', contrastText: '#FFFFFF' },
          background: { default: '#FFFFFF', paper: '#F8F9FA' },
          text: { primary: '#1A1A1A', secondary: '#555555', disabled: '#9E9E9E' },
          divider: 'rgba(0, 0, 0, 0.08)',
          surface: { main: '#F0F0F0' },
        }
      : {
          primary: { main: '#EFEFEF', light: '#FFFFFF', dark: '#C0C0C0', contrastText: '#1A1A1A' },
          // أزرق كهربائي نيون متوهج ومريح للعين في الخلفيات المظلمة
          secondary: { main: '#00D2FF', light: '#33DBFF', dark: '#00A3CC', contrastText: '#1A1A1A' },
          background: { default: '#0B0F19', paper: '#111827' }, // درجات خلفية مائلة للأزرق الداكن الليلي لتعزيز التناسق
          text: { primary: '#EFEFEF', secondary: '#9CA3AF', disabled: '#6B7280' },
          divider: 'rgba(255, 255, 255, 0.08)',
          surface: { main: '#1F2937' },
        }),
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 24 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '0.88rem',
          padding: '12px 26px',
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': { transform: 'translateY(-1.5px)', boxShadow: '0 10px 25px rgba(0,0,0,0.18)' },
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { 
          borderRadius: '8px', 
          fontFamily: '"Syne", sans-serif', 
          fontWeight: 600,
          transition: 'all 0.2s ease'
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));