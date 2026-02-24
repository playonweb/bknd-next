'use client'

import { useAuth } from 'bknd/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, verified, verify } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    verify().catch(() => {});
  }, [verify]);

  useEffect(() => {
    if (!mounted) return;

    setIsRedirecting(false);

    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);
    const isAdminPath = pathname.startsWith('/admin');

    if (verified === undefined || verified === false && user !== undefined) return;

    const isAuthenticated = !!user;

    if (isAuthenticated) {
      if (isPublicPath) {
        setIsRedirecting(true);
        router.replace('/');
      } else if (isAdminPath && user?.role !== 'admin') {
        setIsRedirecting(true);
        router.replace('/');
      }
    } else if (verified !== undefined) {
      if (!isPublicPath && !isAdminPath) {
        setIsRedirecting(true);
        router.replace('/login');
      }
    }
  }, [user, verified, pathname, router, mounted]);

  const publicPaths = ['/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthenticated = !!user;
  
  const canAccessPath = isPublicPath
    ? !isAuthenticated
    : isAdminPath 
      ? (!isAuthenticated || user?.role === 'admin') 
      : isAuthenticated;

  if (!mounted || verified === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <div className="text-[#4a5568] opacity-60 font-medium animate-pulse">
          Loading Neu ToDo...
        </div>
      </div>
    );
  }

  if (isRedirecting || !canAccessPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <div className="text-[#4a5568] opacity-60 font-medium animate-pulse">
          Redirecting...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
