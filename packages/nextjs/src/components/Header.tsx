import Link from 'next/link';
import type { ReactElement } from 'react';

import { TheNavBar } from '@/components/TheNavBar.tsx';

export function Header(): ReactElement {
  return (
    <header className="flex h-16 items-center max-w-7xl px-4 sm:px-6 lg:px-8 gap-8 bg-[#dee1e2]">
      <Link href="/" className="flex items-center shrink-0">
        <img
          alt="Profile Pals"
          src="/logo-md.jpg"
          className="h-16"
        />
        <span className="text-xl">Profile Pals</span>
      </Link>
      <TheNavBar />
    </header>
  );
}
