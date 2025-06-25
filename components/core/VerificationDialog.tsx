'use client';

import { z } from 'zod';
import type React from 'react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { otpSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import type { Response } from '@/types/types';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

type FormValues = z.infer<typeof otpSchema>;

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationSuccess,
}) => {
  const { data: session } = useSession();
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [otp, setOtp] = useState('');

  // Form initialization with Zod validation
  const {
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  // Update form value when OTP changes
  const handleOtpChange = (value: string) => {
    setValue('otp', value, { shouldValidate: true });
  };

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const email = session?.user.email;

      const res = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const resData = (await res.json()) as Response & { retryAfter?: number };

      if (!res.ok) {
        if (res.status === 429 && resData.retryAfter) {
          toast.error(resData.message);
          setCountdown(resData.retryAfter);
          setResendDisabled(true);
        } else {
          toast.error(resData.message || 'An unexpected error occurred.');
        }
        return;
      }

      toast.success('Verification code sent to your email!');
      setStep('verify');
      setCountdown(30);
      setResendDisabled(true);
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (values: FormValues) => {
    if (!values.otp || values.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      const email = session?.user.email;

      const res = await fetch('/api/auth/register/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: values.otp }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const resData = (await res.json()) as Response;

      if (!res.ok) {
        toast.error(resData.message);
        return;
      }

      setIsVerified(true);
      toast.success('Account verified successfully!');

      // Wait a moment to show success state, then close modal
      setTimeout(() => {
        onVerificationSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    try {
      const response = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: session?.user.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resData = (await response.json()) as Response & { retryAfter?: number };
      if (!response.ok) {
        if (response.status === 429 && resData.retryAfter) {
          toast.error(resData.message);
          setCountdown(resData.retryAfter);
          setResendDisabled(true);
        } else {
          toast.error(resData.message || 'Failed to resend code. Please try again.');
        }
      } else {
        toast.success('New verification code sent to your email.');
        clearErrors('otp');
        setValue('otp', '');
        setCountdown(30);
        setResendDisabled(true);
      }
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  const handleClose = () => {
    setStep('send');
    setValue('otp', '');
    setIsLoading(false);
    setIsVerified(false);
    setCountdown(0);
    setResendDisabled(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isVerified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Mail className="h-5 w-5 text-primary" />
            )}
            {isVerified ? 'Account Verified!' : 'Verify Your Account'}
          </DialogTitle>
          <DialogDescription>
            {step === 'send'
              ? "We'll send a verification code to your registered email address."
              : isVerified
                ? 'Your account has been successfully verified.'
                : 'Enter the 6-digit code sent to your email address.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'send' && !isVerified && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {session?.user.email}
                </span>
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={isLoading || resendDisabled}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending Code...
                  </>
                ) : resendDisabled ? (
                  `Try again in ${countdown}s`
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </div>
          )}

          {step === 'verify' && !isVerified && (
            <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      handleOtpChange(value);
                    }}
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
                <p className="text-xs text-muted-foreground text-center">
                  Check your email for the verification code
                </p>
              </div>

              <Button type="submit" disabled={isLoading || !isValid} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the code?{' '}
                <span
                  onClick={handleResendOTP}
                  className={`underline text-primary font-medium hover:text-primary/80 transition-colors duration-200 ${
                    resendDisabled
                      ? 'cursor-not-allowed text-muted-foreground opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Send Again'}
                </span>
              </p>
            </form>
          )}

          {isVerified && (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your account is now verified and ready to use!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
