import { TheNavBar } from '@/components/TheNavBar.tsx';
import type { ReactElement } from 'react';

export function Header(): ReactElement {
  return (
    <header className="flex h-16 items-center max-w-7xl px-4 sm:px-6 lg:px-8 gap-8 bg-gray-800">
      <div className="flex gap-3 shrink-0">
        <img
          alt="Pet Profile Generator"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="size-8"
        />
        <span className="text-xl text-white">PetProfiler</span>
      </div>
      <TheNavBar />
    </header>
  );
}
