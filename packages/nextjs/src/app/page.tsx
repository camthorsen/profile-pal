'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout.jsx';
import { Header } from '@/components/Header.jsx';
import { PrimaryButton } from '@/components/PrimaryButton.jsx';

export default function HomePage(): ReactElement {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setDate(new Date());
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex x-constraint py-12 gap-8 border border-brand-pink">
          <div className="flex flex-col gap-3">
            <h1 className='text-4xl font-bold'>Welcome to the<br/> Pet Profile Generator!</h1>
            <p className='text-xl text-neutral-600'>
              This is an AI tool that allows you to generate a profile for your pet.
            </p>
            <div className="flex mt-3">
              <PrimaryButton text="Get Started" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img src="/logo-sq.jpg" alt="Profile Pals" className="rounded-full h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
