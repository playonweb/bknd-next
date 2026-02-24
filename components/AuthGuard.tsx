'use client'

import { useAuth } from 'bknd/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, verified } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setIsRedirecting(false);

    // Public paths that don't require auth
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);
    const isAdminPath = pathname.startsWith('/admin');

    // If verified is null/undefined, bknd is still loading auth state
    // We wait for it to be explicitly true or false
    if (verified === undefined) return;

    if (verified) {
      if (isPublicPath) {
        setIsRedirecting(true);
        router.replace('/');
      } else if (isAdminPath && user?.role !== 'admin') {
        setIsRedirecting(true);
        router.replace('/');
      }
    } else {
      // Not logged in
      if (!isPublicPath) {
        setIsRedirecting(true);
        router.replace('/login');
      }
    }
  }, [user, verified, pathname, router, mounted]);

  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthenticated = verified === true;
  const canAccessPath = isPublicPath
    ? !isAuthenticated
    : isAuthenticated && (!isAdminPath || user?.role === 'admin');

  if (!mounted || verified === undefined || isRedirecting || !canAccessPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <div className="text-[#4a5568] opacity-60 font-medium animate-pulse">
          Authenticating...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
