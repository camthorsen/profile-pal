import Link from 'next/link';
import type { ReactElement } from 'react';

interface Link {
  name: string;
  href: string;
  current: boolean;
}

export function TheNavBar(): ReactElement {
  const navigation: Link[] = [
    { name: 'Home', href: '#', current: true },
    { name: 'Generator', href: '/generator', current: false },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <nav className="flex justify-start gap-2">
      {navigation.map((item: Link) => (
        <Link
          key={item.name}
          href={item.href}
          className={classNames(
            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'rounded-md px-3 py-2 text-sm font-medium',
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
