import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-400 font-medium">Securing session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their default dashboard based on their role
    return user?.role === 'admin' 
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
