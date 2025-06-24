'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';

const schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Token is missing or invalid.');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Something went wrong');
        reset();
        return;
      }

      toast.success('Password updated successfully!');
      reset();
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reset password.');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/20 p-6 shadow-sm rounded-xl"
      >
        <h2 className="text-xl font-semibold text-center">Reset Your Password</h2>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          {...register('password')}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-gray-900 dark:hover:text-white transition"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-1" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </main>
  );
}
