'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';

const NAVIGATION_LINKS = [
  { label: 'Profile', to: '/user/account/profile' },
  { label: 'Rooms', to: '/user/account/rooms' },
  { label: 'Security', to: '/user/account/security' },
] as const;

export default function ProfileNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Get active link based on current pathname
  const getActiveLink = useCallback(() => {
    const currentLink = NAVIGATION_LINKS.find((link) => pathname.startsWith(link.to));
    return currentLink?.to || '/profile';
  }, [pathname]);

  const activeLink = getActiveLink();

  const handleLinkClick = useCallback(
    (to: string) => {
      router.push(to);
    },
    [router]
  );

  return (
    <div className="sticky top-[81px] z-50 backdrop-blur-sm bg-background/50 dark:bg-background/50">
      <nav className={clsx('relative w-full h-16', 'transition-all duration-300 ease-out')}>
        <div className="relative h-full flex items-center">
          <ul className="px-2 sm:p-0 flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl overflow-x-auto scrollbar-hide container mx-auto">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link.to} className="flex-shrink-0">
                <button
                  onClick={() => handleLinkClick(link.to)}
                  className={clsx(
                    'relative py-3 px-2 transition-all duration-200 ease-out cursor-pointer group',
                    'text-sm font-medium tracking-tight whitespace-nowrap',
                    'focus:outline-none',
                    activeLink === link.to
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {/* Animated bottom border */}
                  <span
                    className={clsx(
                      'absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/80',
                      'transition-all duration-300 ease-out',
                      activeLink === link.to
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
