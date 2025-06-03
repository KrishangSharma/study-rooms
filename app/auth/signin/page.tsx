'use client';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/core/forms/authForm';

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) return;

    const timeout = setTimeout(() => {
      if (error === 'AccountLinked') {
        toast.error(
          'An account with this email already exists. Please log in using your email and password.'
        );
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="w-full min-h-screen grid place-items-center px-5">
      <AuthForm type="signin" />
    </div>
  );
};

export default Page;
