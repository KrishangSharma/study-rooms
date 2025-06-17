'use client';

import Link from 'next/link';
import * as React from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MobileNav } from './MobileNav';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/core/ThemeToggle';
import { CommandMenu } from '@/components/core/SearchCmd/SearchCommand';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, Loader2, CircleUserRound, Archive, LogOut } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { data: session, status } = useSession();

  // React.useEffect(() => {
  //   console.log('Session Data: ', session);
  // }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-sm border-b bg-[#fcf6ec]/70 dark:bg-[#121212]/50 border-gray-300 dark:border-[#212121]">
      <div className="px-2 lg:px-10 mx-auto flex h-20 items-center justify-between transition-all duration-200 ease-in-out">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-xl"
            >
              <span className="text-primary">StudyioVibe</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* //TODO: Update Link routes to be more meaningful */}
              {['Idea', 'Blogs', 'Support'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </motion.div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Command */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="hidden md:flex"
          >
            <CommandMenu />
          </motion.div>

          {/* User Authentication */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="hidden md:inline-block"
          >
            {status === 'loading' ? (
              <>
                {' '}
                <Loader2 className="animate-spin" />{' '}
              </>
            ) : session?.user ? (
              <div className="flex space-x-3">
                <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
                  <DropdownMenuTrigger
                    asChild
                    className="cursor-pointer"
                    onMouseEnter={() => setOpen(true)}
                  >
                    <Avatar className="h-8 w-8 transition-transform hover:scale-110">
                      {process.env.NODE_ENV === 'development' ? (
                        <AvatarImage
                          src={`/api/image-proxy?url=${encodeURIComponent(session.user?.image ?? '')}`}
                          alt={session.user?.name ?? 'User'}
                          onError={(e) => {
                            e.currentTarget.src = '/default-avatar.png';
                          }}
                        />
                      ) : (
                        <AvatarImage
                          src={session.user?.image || ''}
                          alt={session.user?.name ?? 'User'}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    onMouseLeave={() => setOpen(false)}
                    onCloseAutoFocus={(e) => {
                      e.preventDefault();
                    }}
                    className="space-y-1 mt-1"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/account#profile"
                        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-muted"
                      >
                        <CircleUserRound />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/account#rooms"
                        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-muted"
                      >
                        <Archive />
                        My Rooms
                      </Link>
                    </DropdownMenuItem>{' '}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/20"
                      onClick={() => signOut()}
                    >
                      <LogOut />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ThemeToggle />
              </div>
            ) : (
              <div className="space-x-3 flex items-center">
                <Button asChild size="sm" className="gap-2">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            )}
          </motion.div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
