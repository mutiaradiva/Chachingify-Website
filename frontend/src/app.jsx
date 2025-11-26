// src/App.jsx
// Main Application Entry Point

import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/authForm.jsx';
import { DashboardPage } from './pages/dashboardPage';
import { tokenManager } from './utils/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenManager.getToken();
    if (token) {
      // Token exists, set user as authenticated
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ChaChingify...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <DashboardPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
}