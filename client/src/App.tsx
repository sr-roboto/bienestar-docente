import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './services/api';
import Home from './pages/Home';


import Planning from './pages/Planning';
import Mood from './pages/Mood';
import Community from './pages/Community';
import Pomodoro from './pages/Pomodoro';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginCallback from './pages/LoginCallback';
import Profile from './pages/Profile';
import VideoTalleres from './pages/VideoTalleres';
import Juegos from './pages/Juegos';
import Talleres from './pages/Talleres';
import Teatro from './pages/Teatro';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    // Verify token validity with backend
    // If invalid, the interceptor in api.ts will handle the 401 and redirect
    const validateToken = async () => {
      try {
        await authService.getMe();
      } catch (error) {
        console.error("Token validation failed:", error);
      }
    };
    if (token) {
      validateToken();
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/callback" element={<LoginCallback />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="planning" element={<Planning />} />
          <Route path="mood" element={<Mood />} />
          <Route path="community" element={<Community />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="profile" element={<Profile />} />
          <Route path="workshops" element={<VideoTalleres />} />
          <Route path="games" element={<Juegos />} />
          <Route path="talleres" element={<Talleres />} />
          <Route path="teatro" element={<Teatro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
