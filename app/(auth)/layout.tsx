import '../globals.css';
import type React from 'react';
import type { Metadata } from 'next';
import AuthLayoutClient from './AuthLayoutClient';

export const metadata: Metadata = {
  title: 'Authentication | StudyioVibe',
  description: 'Secure login and registration for StudyioVibe - The future of study rooms',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutClient children={children} />;
}
