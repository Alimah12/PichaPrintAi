 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratorInterface } from '../../src/components/GeneratorInterface';
import { getToken } from '../../src/lib/auth';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) router.push('/login');
  }, [router]);

  return <GeneratorInterface initialShowGenerator={true} />;
}
