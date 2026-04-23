 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratorInterface } from '../../src/components/GeneratorInterface';
import { getToken } from '../../src/lib/auth';
import { getAdminToken, checkAdminAccess } from '../../src/lib/adminAuth';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = getToken();
      const adminToken = getAdminToken();

      if (!token) {
        console.debug('[demo] no token, redirecting to /login');
        router.push('/login');
        return;
      }

      if (adminToken) {
        // Verify admin privileges before redirecting
        try {
          const isAdmin = await checkAdminAccess(adminToken);
          if (isAdmin) {
            console.debug('[demo] admin detected, redirecting to /admin');
            router.push('/admin');
          }
        } catch (e) {
          console.warn('[demo] admin check failed', e);
        }
      }
    })();
  }, [router]);

  return <GeneratorInterface initialShowGenerator={true} />;
}
