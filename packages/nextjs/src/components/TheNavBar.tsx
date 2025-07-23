import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';

interface NavLink {
  name: string;
  href: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function TheNavBar(): ReactElement {
  const pathname = usePathname();
  
  const navigation: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Bio Generator', href: '/generator' },
  ];

  return (
    <nav className="flex justify-start gap-2">
      {navigation.map((item: NavLink) => {
        const isCurrent = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              isCurrent ? 'bg-brand-orange text-gray-900' : 'hover:text-white hover:bg-brand-pink',
              'rounded-md px-3 py-2 text-sm font-medium',
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
