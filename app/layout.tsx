// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Providers from '@/components/core/Providers';
import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudyioVibe | By Krishang Sharma',
  description: 'Mann laga ke padho!!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.className}`}>
      <body className="min-h-screen bg-[#fcf6ec] text-gray-950 dark:bg-[#121212] dark:text-gray-100">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
