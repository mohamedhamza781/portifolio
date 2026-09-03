import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeModeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

// AdminPage and AdminLogin pull in the entire MUI icon set + a large admin
// dashboard that public visitors never touch. Lazy-loading them means
// regular portfolio visitors only download the code for the public site —
// the admin bundle is fetched on demand, only when someone actually visits
// /admin or /admin/login.
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const RouteFallback = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress size={28} />
  </Box>
);

function ProtectedRoute({ children }) {
  // "token" is the real JWT saved by AdminLogin.jsx after a successful
  // POST /api/auth/login. api.js attaches it as Authorization: Bearer <token>
  // on every request, so the backend does the actual verification too —
  // this check only gates client-side navigation.
  if (!localStorage.getItem("token")) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<RouteFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<RouteFallback />}>
                  <AdminPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeModeProvider>
  );
}

export default App;