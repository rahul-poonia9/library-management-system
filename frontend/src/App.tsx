import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import IssueBook from "./pages/IssueBook";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm bg-red-50 p-4 rounded mb-4 overflow-auto">
          {error.message}
        </pre>
        <Button onClick={resetErrorBoundary} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/books" 
        element={
          <ProtectedRoute>
            <Layout>
              <Books />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/students" 
        element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/issue-book" 
        element={
          <ProtectedRoute>
            <Layout>
              <IssueBook />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
