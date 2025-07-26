import { type ReactElement } from 'react';

interface H1Props {
  children: React.ReactNode;
}

export function H1({ children }: H1Props): ReactElement {
  return (
    <h1 className="text-2xl font-bold">{children}</h1>
  );
}
