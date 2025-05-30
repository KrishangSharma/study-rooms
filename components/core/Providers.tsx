'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

interface ProvidersProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children, ...props }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </SessionProvider>
  );
}
