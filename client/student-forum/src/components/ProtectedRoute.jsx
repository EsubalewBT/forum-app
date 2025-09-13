import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../Utils/tokenStore';

const ProtectedRoute = () => {
  const token = getAccessToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
