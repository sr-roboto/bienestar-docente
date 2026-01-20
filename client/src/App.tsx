import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { Home } from './components/Placeholders';
import Crisis from './pages/Crisis';
import Planning from './pages/Planning';
import Mood from './pages/Mood';
import Community from './pages/Community';
import Pomodoro from './pages/Pomodoro';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginCallback from './pages/LoginCallback';

// Simple protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

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
          <Route path="crisis" element={<Crisis />} />
          <Route path="planning" element={<Planning />} />
          <Route path="mood" element={<Mood />} />
          <Route path="community" element={<Community />} />
          <Route path="pomodoro" element={<Pomodoro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
