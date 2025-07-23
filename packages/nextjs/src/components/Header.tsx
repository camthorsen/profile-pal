import Link from 'next/link';
import type { ReactElement } from 'react';

import { TheNavBar } from '@/components/TheNavBar.tsx';

export function Header(): ReactElement {
  return (
    <header className="x-constraint flex h-16 items-center gap-8 bg-white shadow-sm">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img
          alt="Profile Pals"
          src="/logo-sq.jpg"
          className="h-12 rounded-full"
        />
        <span className="text-xl text-brand-purple font-brand">Profile Pals</span>
      </Link>
      <TheNavBar />
    </header>
  );
}
