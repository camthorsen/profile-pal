'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

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
      <h1 className="h1">Welcome to the Pet Profile Generator!</h1>
      <p>The current time is {date && date.toString()}</p>
    </Layout>
  );
}
