'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { H1 } from '@/components/typography/H1.tsx';

import Layout from '../components/Layout.jsx';

export default function HomePage(): ReactElement {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(new Date());
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <Layout title="Home | Pet Profiler App">
      <H1>Welcome to the Pet Profile Generator!</H1>
      <img src="/logo-sq.jpg" alt="Profile Pals" className="rounded-full h-36" />
      <p>The current time is {date && date.toString()}</p>
    </Layout>
  );
}
