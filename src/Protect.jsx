import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const Protect = () => {
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default Protect;
