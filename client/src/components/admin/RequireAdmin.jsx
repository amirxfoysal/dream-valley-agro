import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import SplashScreen from '../SplashScreen.jsx';

export default function RequireAdmin({ children }) {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Admin — Dream Valley Agro';
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}