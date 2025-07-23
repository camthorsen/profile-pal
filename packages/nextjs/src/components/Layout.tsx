import Head from 'next/head';
import type { PropsWithChildren, ReactElement } from 'react';

import { Header } from './Header.jsx';

function Layout({ children, title = 'This is the default title' }: Readonly<Props>): ReactElement {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/jpg" href="/logo-sm.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Oldenburg&display=swap" rel="stylesheet" />
      </Head>
      <Header />
      <main className="py-4">{children}</main>
      <footer className="py-4">
        <hr />
        <span>Footer</span>
      </footer>
    </div>
  );
}

interface Props extends PropsWithChildren {
  title?: string;
}

export default Layout;
