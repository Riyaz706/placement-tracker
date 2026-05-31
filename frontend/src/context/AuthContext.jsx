import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user details on load
  const fetchProfile = async (currentToken) => {
    try {
      const response = await apiClient.get('/users/profile');
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: loggedUser } = response.data;
        setToken(receivedToken);
        setUser(loggedUser);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return { success: true, role: loggedUser.role };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await apiClient.post('/users/register', userData);
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  const uploadResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await apiClient.put('/users/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        // Refresh profile to update resume URL
        await fetchProfile(token);
        return { success: true, resumeUrl: response.data.resume };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload resume.';
      return { success: false, message };
    }
  };

  const syncExternalProfile = async (platform, username) => {
      try {
        const response = await apiClient.post('/users/sync-profile', { platform, username });
        if (response.data.success) {
          // Update local user state
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message };
      } catch (err) {
        const message = err.response?.data?.message || `Failed to sync ${platform} profile.`;
        return { success: false, message };
      }
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        uploadResume,
        syncExternalProfile,
        refreshProfile: () => fetchProfile(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
