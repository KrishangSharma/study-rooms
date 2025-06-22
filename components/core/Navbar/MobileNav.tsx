'use client';

import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import {
  ChevronDown,
  LogIn,
  Menu,
  User,
  Settings,
  LogOut,
  Home,
  Lightbulb,
  BookOpen,
  HelpCircle,
  UserPlus,
} from 'lucide-react';
import { ThemeToggle } from '@/components/core/ThemeToggle';
import { CommandMenu } from '@/components/core/SearchCmd/SearchCommand';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Idea', href: '/idea', icon: Lightbulb },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Support', href: '/support', icon: HelpCircle },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full bg-background/95 dark:bg-background/95 backdrop-blur-xl border-l border-slate-200/20 dark:border-slate-800/20 pr-0"
      >
        <SheetHeader className="text-left pb-4 border-b border-slate-200/20 dark:border-slate-800/20">
          <SheetTitle className="font-bold text-xl">
            <motion.span
              className="text-primary"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              StudyioVibe
            </motion.span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Search Section */}
          <div className="px-3 py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CommandMenu isMobile />
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3">
            <div className="space-y-2">
              {navigationItems.map((item, i) => {
                const isActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 py-3 px-4 rounded-xl text-foreground transition-all duration-200',
                        'hover:bg-slate-200/60 dark:hover:bg-slate-800/60',
                        'active:scale-95',
                        isActive && ['bg-primary/10 text-primary', 'font-medium']
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Theme Section */}
          <motion.div
            className="px-3 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-300/30 dark:bg-slate-800/30">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* User Section */}
          <motion.div
            className="mt-auto border-t border-slate-200/20 dark:border-slate-800/20 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 p-3 h-auto hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
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
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-semibold truncate">{session.user?.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-background dark:bg-background border-slate-200/20 dark:border-slate-800/20"
                >
                  <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200/20 dark:bg-slate-800/20" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user/account/profile"
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user/account/settings"
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200/20 dark:bg-slate-800/20" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex flex-row gap-3">
                <Button asChild className="w-full gap-2 h-12 font-medium">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    <LogIn />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button asChild className="w-full gap-2 h-12 font-medium" variant="outline">
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    <UserPlus />
                    <span>Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
