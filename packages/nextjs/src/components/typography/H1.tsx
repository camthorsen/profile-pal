import { type ReactElement } from 'react';

interface H1Props {
  children: React.ReactNode;
  id?: string;
}

export function H1({ children, id }: H1Props): ReactElement {
  return (
    <h1 id={id} className="text-2xl font-bold">{children}</h1>
  );
}
