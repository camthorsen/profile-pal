import type { PropsWithChildren, ReactElement } from 'react';

import '../styles/globals.css';

export const metadata = {
  title: 'Profile Pals',
  description: 'Generate pet profiles from audio and images',
  icons: {
    icon: '/logo-sm.jpg',
    shortcut: '/logo-sm.jpg',
    apple: '/logo-sm.jpg',
  },
};

export default function RootLayout({ children }: PropsWithChildren): ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
