// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/core/Providers';

export const metadata: Metadata = {
  title: 'Study Rooms | By Krishang Sharma',
  description: 'Mann laga ke padho!!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 text-gray-950 dark:bg-[#030303] dark:text-gray-100">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  );
}
