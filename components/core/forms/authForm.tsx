'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { logInSchema } from '@/lib/schemas';
import { signUpSchema } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormProps, Response } from '@/types/types';

type LoginFormData = z.infer<typeof logInSchema>;
type SignupFormData = z.infer<typeof signUpSchema>;

export default function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isLogin = type === 'signin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? logInSchema : signUpSchema),
  });

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsLoading(true);
    try {
      // Prepare data for your API endpoints
      const formData = {
        email: data.email,
        password: data.password,
        ...(type === 'signup' && { name: (data as SignupFormData).name }),
      };

      if (isLogin) {
        await handleCredentialSignIn({
          email: formData.email,
          password: formData.password,
        });
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const regRes = (await response.json()) as Response;

        if (!response.ok) {
          toast.error(regRes.message || 'Something went wrong');
          return;
        }
        // Send the verification code to the user's email
        const res = await fetch('/api/auth/register/send-otp', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email }),
          headers: {
            'Content-type': 'application/json',
          },
        });
        const resData = (await res.json()) as Response;
        if (!res.ok) {
          console.log(resData.message);
          toast.error(resData.message);
          return;
        }
        window.location.href = `/auth/verify?email=${formData.email}`;
        reset();
      }
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again');
    } finally {
      reset();
      setIsLoading(false);
    }
  };

  const handleCredentialSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      });

      if (res?.error) {
        toast.error(res?.error);
      } else if (res?.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      });
    } catch (error) {
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="sm:w-md transition-all duration-200 ease-in-out">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-lg border border-gray-200 dark:border-white/20 p-8 space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {isLogin ? 'Welcome back' : 'Join StudyioVibe'}
          </h1>
          <p className="text-gray-600 dark:text-gray-200 text-sm">
            {isLogin
              ? 'Sign in to your account to continue'
              : 'Sign up to get started with your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in-50 slide-in-from-left-4 duration-200">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-100 after:content-['*'] after:text-destructive after:-ml-2"
              >
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register('name' as keyof SignupFormData)}
                className="h-11 border-gray-300 dark:border-white/20 focus:ring-0 transition-colors duration-200"
              />
              {!isLogin && 'name' in errors && (
                <p className="text-xs text-red-600 animate-in fade-in-50 duration-200">
                  {errors.name?.message}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-left-4 duration-200">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-100 after:content-['*'] after:text-destructive after:-ml-2"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="h-11 border-gray-300 dark:border-white/20 focus:ring-0 transition-colors duration-200"
            />
            {errors.email && (
              <p className="text-xs text-red-600 animate-in fade-in-50 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-left-4 duration-200">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-100 after:content-['*'] after:text-destructive after:-ml-2"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className="h-11 border-gray-300 dark:border-white/20 focus:border-gray-900 focus:ring-0 transition-colors duration-200 pr-10"
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
            {errors.password && (
              <p className="text-xs text-red-600 animate-in fade-in-50 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Forget Password */}
          {isLogin && (
            <div className="animate-in fade-in-50 slide-in-from-left-4 duration-200">
              <Link
                href="/auth/forgot-password"
                className="hover:underline cursor-pointer text-xs text-muted-foreground"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full h-11 bg-gray-900 hover:bg-gray-900/90 text-white dark:bg-gray-600/50 dark:hover:bg-gray-600/30 font-medium transition-colors cursor-pointer animate-in fade-in-50 slide-in-from-bottom-4 duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Divider */}
          <div className="relative animate-in fade-in-50 duration-200">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#191919] dark:text-gray-200 px-2 text-gray-500">
                Or
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-11 border-gray-300 bg-gray-100/10 hover:bg-gray-100 text-gray-700 dark:bg-white dark:text-accent font-medium transition-colors animate-in fade-in-50 slide-in-from-bottom-4 duration-200 cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 animate-in fade-in-50 duration-200">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="font-medium text-gray-900 dark:text-gray-200 hover:underline transition-colors duration-200 cursor-pointer"
          >
            <Link href={type === 'signin' ? '/auth/register' : '/auth/login'}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
