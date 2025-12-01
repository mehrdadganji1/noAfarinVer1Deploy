import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

export function PublicRoute({ 
  children, 
  redirectIfAuthenticated = false 
}: PublicRouteProps) {
  const { token, user } = useAuthStore();
  const isAuthenticated = !!(token && user);

  console.log('🌐 PublicRoute:', { 
    hasToken: !!token, 
    hasUser: !!user, 
    isAuthenticated, 
    redirectIfAuthenticated,
    willRedirect: isAuthenticated && redirectIfAuthenticated
  });

  if (isAuthenticated && redirectIfAuthenticated) {
    console.log('↪️ Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Showing public content');
  return <>{children}</>;
}
