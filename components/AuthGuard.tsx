'use client'

import { useAuth } from 'bknd/client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, verified } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Public paths that don't require auth
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);
    const isAdminPath = pathname.startsWith('/admin');

    // If verified is null/undefined, bknd is still loading auth state
    // We wait for it to be explicitly true or false
    if (verified === undefined) return;

    if (verified) {
      if (isPublicPath) {
        router.push('/');
      } else if (isAdminPath && user?.role !== 'admin') {
        router.push('/');
      } else {
        setIsReady(true);
      }
    } else {
      // Not logged in
      if (!isPublicPath) {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    }
  }, [user, verified, pathname, router, mounted]);

  if (!mounted || !isReady) {
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
