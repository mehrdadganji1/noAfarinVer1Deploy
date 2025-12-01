import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function DebugRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    console.log('🔍 DebugRouter - Route Change:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userRoles: user?.role,
      timestamp: new Date().toISOString()
    });
  }, [location, isAuthenticated, user, token]);

  return null;
}
