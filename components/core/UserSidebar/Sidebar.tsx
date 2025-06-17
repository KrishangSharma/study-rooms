'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Link as LinkType } from '@/types/types';

const links: LinkType[] = [
  { label: 'Profile', to: '#profile' },
  { label: 'Rooms', to: '#rooms' },
  { label: 'Security', to: '#security' },
];

const Sidebar = () => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    console.log('Active ID:', activeId);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="w-full h-full p-5 flex flex-col gap-4 items-start">
      {links.map((link) => (
        <Link
          key={link.to}
          href={`/user/account${link.to}`}
          className={clsx(
            'w-full py-2 px-3 rounded-xl transition-all duration-200',
            activeId === link.to.replace('#', '')
              ? 'bg-primary text-white dark:bg-primary/80'
              : 'text-muted-foreground hover:text-foreground hover:bg-slate-300/60 dark:hover:bg-slate-800/60'
          )}
        >
          {link.label}
        </Link>
      ))}
    </main>
  );
};

export default Sidebar;
