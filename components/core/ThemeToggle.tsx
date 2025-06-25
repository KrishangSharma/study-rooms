'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const preferredTheme = localStorage.getItem('preferred-theme');
    if (preferredTheme === 'light' || preferredTheme === 'dark' || preferredTheme === 'system') {
      setTheme(preferredTheme);
    } else {
      setTheme('system');
    }
  }, [setTheme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('preferred-theme', newTheme);
    setTheme(newTheme);
  };

  if (!mounted) return null;

  const iconClasses = 'w-4 h-4 transition-all';
  const iconMap = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const themeLabels: Record<string, string> = {
    light: 'Light Theme',
    dark: 'Dark Theme',
    system: 'System Theme',
  };

  const current =
    resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : 'system';
  const CurrentIcon = iconMap[current];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 px-2 ">
          <CurrentIcon className={iconClasses} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1">
        {Object.entries(iconMap).map(([key, Icon]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleThemeChange(key as 'light' | 'dark' | 'system')}
            className="cursor-pointer"
          >
            <Icon className="w-4 h-4 mr-2" />
            {themeLabels[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
