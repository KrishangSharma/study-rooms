'use client';

import type { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { otpSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Response } from '@/types/types';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Shield, ArrowRight } from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type FormValues = z.infer<typeof otpSchema>;

const Page = () => {
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  // Form Initialization with Zod validation
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  const otpValue = watch('otp');

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = {
        email,
        otp: otpValue,
      };
      const response = await fetch('/api/auth/register/verify-otp', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = (await response.json()) as Response;

      if (!response.ok) {
        toast.error(res.message);
        return;
      }

      toast.success('Account verified successfully!');
      reset();
      window.location.href = '/auth/signin';
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    clearErrors('otp');
    setValue('otp', '');
    setCountdown(30);
    setResendDisabled(true);

    try {
      const response = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = (await response.json()) as Response;
      if (!response.ok) {
        toast.error(res.message);
      } else {
        toast.success('New verification code sent to your email.');
      }
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf6ec] dark:bg-[#121212] flex items-center justify-center p-4">
      <Card className="shadow-lg border-0 bg-white dark:bg-[#191919] w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Account</h1>
            <p className="text-muted-foreground">We've sent a verification code to you at</p>
          </div>
          <CardDescription className="text-base font-medium text-foreground">
            {email || 'your email address'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP Input */}
            <div className="space-y-3">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otpValue}
                  onChange={(val) => setValue('otp', val)}
                  aria-label="OTP input"
                  aria-invalid={!!errors.otp}
                  aria-describedby={errors.otp ? 'otp-error' : undefined}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg font-semibold" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg font-semibold" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg font-semibold" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg font-semibold" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg font-semibold" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg font-semibold" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errors.otp && (
                <p className="text-sm text-destructive text-center" id="otp-error">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              className="w-full h-11 font-medium"
              disabled={isLoading || !otpValue || otpValue.length !== 6}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>

          {/* Resend Section */}
          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the code?
            <span
              onClick={handleResendOTP}
              className={`ml-1 underline text-primary font-medium text-sm hover:text-gray-700 transition-colors duration-200 ${resendDisabled ? 'cursor-not-allowed  text-muted-foreground opacity-50' : `cursor-pointer`}`}
            >
              {resendDisabled ? `Resend in ${countdown}s` : 'Send Again'}
            </span>
          </p>
          <DropdownMenuSeparator className="mb-5" />

          {/* Skip Verification */}
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" className="flex items-center gap-2">
                      Skip Verification
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You can verify later in profile settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
