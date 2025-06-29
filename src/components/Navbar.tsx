// src/components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { name: 'Invest', icon: '📈', path: '/investing' },
  { name: 'Business', icon: '🏢', path: '/business' },
  { name: 'Earnings', icon: '💸', path: '/' },
  { name: 'Items', icon: '🧳', path: '/items' },
  { name: 'Profile', icon: '👤', path: '/profile' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-2px_6px_rgba(0,0,0,0.05)] flex justify-around items-center py-2 px-4 z-50 text-xs font-medium">
      {navItems.map((item) => {
        const isActive = router.pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center transition-all duration-200 ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
