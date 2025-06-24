'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Kbd } from '@/components/ui/kbd';
import { signOut, useSession } from 'next-auth/react';

interface CommandMenuProps {
  isMobile?: boolean;
}

export function CommandMenu({ isMobile = false }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('preferred-theme', next);
    setTheme(next);
  };

  return (
    <>
      <Button
        variant="outline"
        className={`relative text-sm text-muted-foreground ${isMobile ? 'w-full justify-between' : 'w-60 justify-between'}`}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
        </div>
        {!isMobile && (
          <>
            <Kbd className="ml-auto text-xs">Ctrl</Kbd>
            <Kbd className="text-xs">K</Kbd>
          </>
        )}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <span className="block">Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/user/account/profile'))}>
              <span>Profile</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="User Actions">
            {session?.user ? (
              <CommandItem onSelect={() => runCommand(signOut)}>Log Out</CommandItem>
            ) : (
              <CommandItem onSelect={() => runCommand(() => router.push('/auth/login'))}>
                Log In
              </CommandItem>
            )}
            <CommandItem onSelect={() => runCommand(toggleTheme)}>Switch Theme</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
