 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratorInterface } from '../../src/components/GeneratorInterface';
import { getToken } from '../../src/lib/auth';
import { getAdminToken } from '../../src/lib/adminAuth';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const adminToken = getAdminToken();
    
    if (!token) {
      console.debug('[demo] no token, redirecting to /login');
      router.push('/login');
      return;
    }
    
    if (adminToken) {
      console.debug('[demo] admin detected, redirecting to /admin/analytics');
      router.push('/admin/analytics');
    }
  }, [router]);

  return <GeneratorInterface initialShowGenerator={true} />;
}
