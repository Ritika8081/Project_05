import React from 'react';
import Link from 'next/link';

interface NavBarProps {
  currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/check-in', label: 'Check In', icon: '💭' },
    { href: '/mirror', label: 'Mirror', icon: '🪞' },
    { href: '/correlations', label: 'Patterns', icon: '📊' },
    { href: '/journal', label: 'Journal', icon: '📝' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-orange-50 to-orange-50/95 border-t border-orange-200 shadow-xl z-40">
      <div className="w-full px-1 sm:px-2 py-1 sm:py-2">
        <div className="flex justify-around gap-0.5 sm:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-0.5 sm:px-1 rounded-lg
                transition-all duration-300 ease-out text-xs font-medium
                min-h-[60px] sm:min-h-[72px]
                ${
                  currentPath === item.href
                    ? 'bg-gradient-to-br from-orange-300 to-rose-300 text-orange-950 ring-1 ring-orange-400 shadow-md'
                    : 'text-orange-800 hover:bg-orange-100/60'
                }
              `}
            >
              <span className="text-base sm:text-lg mb-0.5">{item.icon}</span>
              <span className="text-xs leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
