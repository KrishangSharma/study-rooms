'use client';

import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LogIn, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CommandMenu } from '@/components/core/SearchCmd/SearchCommand';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[80%] bg-[#fcf6ec] dark:bg-[#191919] border-l border-slate-200 dark:border-slate-800 pr-0"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-bold text-xl">
            <span className="text-primary">StudyioVibe</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          <div className="px-2">
            <div className="mb-4">
              <CommandMenu isMobile />
            </div>

            <div className="space-y-3 mt-6">
              {['Home', 'Idea', 'Support'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center py-3 px-2 rounded-lg text-foreground',
                      'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors'
                    )}
                  >
                    <span className="font-medium">{item}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 px-2">
            {session ? (
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {session.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{session.user?.name}</span>
                  <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                </div>
              </div>
            ) : (
              <Button asChild className="w-full gap-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
