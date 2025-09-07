import Link from 'next/link';
import type { ReactElement } from 'react';

import { TheNavBar } from '@/components/TheNavBar.tsx';

export function Header(): ReactElement {
  return (
    <div className="w-full bg-white shadow-sm">
      <header className="x-constraint flex h-16 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            alt="Profile Pal"
            src="/logo-sq.jpg"
            className="h-12 rounded-full"
          />
          <span className="text-xl text-brand-purple font-brand">Profile Pal</span>
        </Link>
        <TheNavBar />
      </header>
    </div>
  );
}
