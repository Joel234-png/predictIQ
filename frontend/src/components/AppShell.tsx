'use client';

/**
 * AppShell — primary app-wide navigation (#1314).
 *
 * The landing page (`/`) already owns its own full marketing header/nav/
 * footer (components/LandingPage.tsx — separate anchor-link nav for
 * #features/#how-it-works/#about/#contact), so AppShell skips rendering
 * on `/` to avoid a duplicate header there. Everywhere else (Markets,
 * Statistics, Create Market, account, tx, and — conditionally, once an
 * admin session exists — Admin) gets a persistent header with primary
 * navigation and a minimal footer, matching the sub-nav pattern already
 * established by app/admin/layout.tsx for its own section.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/markets', label: 'Markets' },
  { href: '/statistics', label: 'Statistics' },
  { href: '/markets/create', label: 'Create Market' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    setHasAdminSession(Boolean(sessionStorage.getItem('predictiq-admin-key')));
  }, [pathname]);

  const isLandingPage = pathname === '/';
  const isAdminSection = pathname?.startsWith('/admin');

  if (isLandingPage || isAdminSection) {
    return <>{children}</>;
  }

  const navItems = hasAdminSession
    ? [...NAV_ITEMS, { href: '/admin/content', label: 'Admin' }]
    : NAV_ITEMS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#app-main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        role="banner"
        className="app-shell__header"
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'color-mix(in srgb, var(--surface) 92%, transparent)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="app-shell__header-inner">
          <Link
            href="/"
            aria-label="PredictIQ Home"
            style={{ textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}
          >
            <span style={{ color: 'var(--fg)' }}>Predict</span>
            <span style={{ color: 'var(--gold)' }}>IQ</span>
          </Link>

          <nav aria-label="Primary navigation" className="app-shell__nav">
            <ul className="app-shell__nav-list">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className="app-shell__nav-link"
                      style={{
                        color: isActive ? 'var(--gold)' : 'var(--fg-muted)',
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main id="app-main-content" role="main" style={{ flex: 1 }}>
        {children}
      </main>

      <footer
        role="contentinfo"
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-muted)',
        }}
      >
        © {new Date().getFullYear()} PredictIQ. Built on Stellar.
      </footer>
    </div>
  );
}

export default AppShell;
