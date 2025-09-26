'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdministrationPage from '@/components/Administration/AdministrationPage';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      if (!u || u.role !== 'admin') router.replace('/');
    } catch { router.replace('/'); }
  }, [router]);

  // return <AdminVolunteerOpportunities />;
  return <AdministrationPage />
}
