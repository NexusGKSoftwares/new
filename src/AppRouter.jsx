import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingIcon from './components/LoadingIcon'; // Correctly import LoadingIcon

// Lazy-loaded components for better performance
const App = React.lazy(() => import('./App'));
const LoginPage = React.lazy(() => import('./components/Auth/LoginPage'));
const MainPage = React.lazy(() => import('./components/Main/MainPage')); // Add MainPage import

const AppRouter = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Check authentication

  return (
    <Router>
      <Suspense
        fallback={
          <LoadingIcon
            text="Please wait, loading..."
            primaryColor="#24ecff"
            secondaryColor="#93ff2d"
            tertiaryColor="#e41cf8"
          />
        }
      >
        <Routes>
          {/* Main Page as the starting route */}
          <Route path="/" element={<MainPage />} />

          {/* Login Page with redirection if authenticated */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/app" replace /> : <LoginPage />}
          />

          {/* Protected Route */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          {/* Redirect to /login by default if no match */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
