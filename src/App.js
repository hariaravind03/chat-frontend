import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import FriendRequests from './Dashboard/FriendRequests';
import FriendsList from './Dashboard/FriendsList';
import DashboardHome from './Dashboard/DashboardHome';
import ProtectedRoute from './components/protectedRoutes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="requests" element={<FriendRequests />} />
        <Route path="friends" element={<FriendsList />} />
      </Route>
    </Routes>
  );
}

export default App;
