import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load components for better initial load performance
const App = React.lazy(() => import('./App'));
const LoginPage = React.lazy(() => import('./components/Auth/LoginPage'));
const MainPage = React.lazy(() => import('./components/Main/MainPage'));

// Styled container for proper layout management
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="error-container">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

// Protected Route with enhanced security and loading states
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Enhanced authentication check
  const isAuthenticated = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.token && new Date(user.expiresAt) > new Date();
    } catch (error) {
      console.error('Auth validation error:', error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Preserve the attempted URL for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Route configuration with metadata
const routeConfig = [
  {
    path: '/',
    element: <MainPage />,
    layoutStyle: 'landing'
  },
  {
    path: '/login',
    element: <LoginPage />,
    layoutStyle: 'auth'
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    layoutStyle: 'app'
  }
];

// Layout wrapper component for style isolation
const LayoutWrapper = ({ children, layoutStyle }) => {
  // Define layout-specific styles
  const layoutStyles = {
    landing: {
      backgroundColor: '#ffffff',
      padding: '0',
      maxWidth: '100%'
    },
    auth: {
      backgroundColor: '#f5f5f5',
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto'
    },
    app: {
      backgroundColor: '#fafafa',
      padding: '1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={layoutStyles[layoutStyle]}
      className={`layout-wrapper layout-${layoutStyle}`}
    >
      {children}
    </motion.div>
  );
};

function Index() {
  // Theme configuration for styled-components
  const theme = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745'
    },
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px'
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <PageContainer>
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                <Routes>
                  {routeConfig.map(({ path, element, layoutStyle }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <LayoutWrapper layoutStyle={layoutStyle}>
                          {element}
                        </LayoutWrapper>
                      }
                    />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </PageContainer>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default Index;
