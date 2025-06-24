'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
        headers: {
          'Content-type': 'application/json',
        },
      });
      setSentEmail(data.email);
      setIsEmailSent(true);
      reset();
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  const handleBackToForm = () => {
    setIsEmailSent(false);
    setSentEmail('');
  };

  return (
    <main className="grid place-items-center w-full h-screen bg-background dark:bg-background transition-colors duration-200">
      {isEmailSent ? (
        <Card className="w-full max-w-md border border-gray-200 dark:border-white/20 shadow-lg bg-white dark:bg-[#191919]">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Check Your Email
            </CardTitle>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{sentEmail}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md border border-gray-200 dark:border-white/20 shadow-sm bg-white dark:bg-[#191919]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
              Forgot Password
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Enter your email address and we'll send you a reset link
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-100 after:content-['*'] after:text-destructive after:ml-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  className="h-11 border-gray-300 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-300 focus:ring-0 transition-colors duration-200"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default ForgotPassword;
