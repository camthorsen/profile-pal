import type { ReactElement } from 'react';

export function Footer(): ReactElement {
  return (
    <div className="w-full bg-neutral-800">
      <footer className="x-constraint flex items-center mx-auto p-4">
        <p className="text-sm text-white opacity-70">
          Demo app created by Camilla Thorsen (2025)
        </p>
      </footer>
    </div>
  );
}
