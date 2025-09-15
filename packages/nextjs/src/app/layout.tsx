import type { PropsWithChildren, ReactElement } from 'react';

import { SkipLink } from '@/components/SkipLink.tsx';

import '../styles/globals.css';

export const metadata = {
  title: 'Profile Pal',
  description: 'Generate pet profiles from audio and images',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  themeColor: '#c15764',
  icons: {
    icon: '/logo-sm.jpg',
    shortcut: '/logo-sm.jpg',
    apple: '/logo-sm.jpg',
  },
  openGraph: {
    title: 'Profile Pal',
    description: 'Generate pet profiles from audio and images',
    type: 'website',
  },
};

export default function RootLayout({ children }: PropsWithChildren): ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
