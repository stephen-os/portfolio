'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/', label: 'home' },
  { path: '/projects', label: 'projects' },
  { path: '/posts', label: 'posts' },
  { path: '/gallery', label: 'gallery' },
  { path: '/about', label: 'about' },
  { path: '/contact', label: 'contact' },
];

export function TerminalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Build clickable path segments
  const pathSegments =
    pathname === '/'
      ? []
      : pathname.split('/').filter(Boolean).map((segment, index, all) => ({
          label: segment,
          path: '/' + all.slice(0, index + 1).join('/'),
        }));

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between border-b border-border bg-bg-alt z-50">
      {/* Terminal prompt */}
      <div className="flex items-center mono text-sm min-w-0">
        <span className="text-accent">stephen</span>
        <span className="text-muted">@</span>
        <span className="text-accent-alt">portfolio</span>
        <span className="text-muted">:</span>
        <Link href="/" className="text-fg hover:opacity-70 transition-opacity">
          ~
        </Link>
        {pathSegments.map((segment) => (
          <span key={segment.path} className="truncate">
            <span className="text-muted">/</span>
            <Link
              href={segment.path}
              className="text-fg hover:opacity-70 transition-opacity"
            >
              {segment.label}
            </Link>
          </span>
        ))}
        <span className="cursor-blink inline-block w-2 h-4 ml-1 bg-accent flex-shrink-0" />
      </div>

      {/* Desktop navigation */}
      <ul className="hidden md:flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`text-sm transition-colors hover:opacity-80 ${
                  isActive ? 'text-accent' : 'text-fg'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden text-fg p-2 -mr-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <ul
          id="mobile-nav-menu"
          className="md:hidden absolute top-14 left-0 right-0 flex flex-col py-2 border-b border-border bg-bg-alt"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={closeMenu}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block px-6 py-3 text-sm transition-colors hover:bg-surface ${
                    isActive ? 'text-accent' : 'text-fg'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
