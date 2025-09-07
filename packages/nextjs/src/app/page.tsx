'use client';

import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { Footer } from '@/components/Footer.jsx';
import { Header } from '@/components/Header.jsx';
import { PrimaryButton } from '@/components/PrimaryButton.jsx';

import Layout from '../components/Layout.jsx';

export default function HomePage(): ReactElement {
  const router = useRouter();
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
          <div className="flex flex-col gap-3 max-w-xl">
            <h1 className='text-4xl font-bold'>A free tool to help animals<br/>find their forever homes!</h1>
            <p className='text-xl text-neutral-600'>
              Profile Pal is a multi-language AI tool that allows you to create engaging profile bios, using only a photo and a voice recording.
            </p>
            <div className="flex mt-3">
              <PrimaryButton text="Get Started" onClick={() => router.push('/generator')} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img src="/logo-sq.jpg" alt="Profile Pals" className="rounded-full h-64" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
