import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeModeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';

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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeModeProvider>
  );
}

export default App;