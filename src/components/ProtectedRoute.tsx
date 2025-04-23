'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, hasRole, UserRole } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/dashboard');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
} 