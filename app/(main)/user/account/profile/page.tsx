'use client';

import type React from 'react';
import { toast } from 'sonner';
import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PasswordData, Response, UserData } from '@/types/types';
import { AvatarUploader } from '@/components/core/AvatarUploader';
import { VerificationModal } from '@/components/core/VerificationDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Loader2,
  Edit3,
  Save,
  X,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserDetailsPage = () => {
  const { data: session, status, update } = useSession();
  console.log(session);

  // Profile Management State
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    image: null,
    isEmailVerified: false,
    hasGoogleConnection: session?.user.provider === 'google',
  });
  const [profileFormData, setProfileFormData] = useState<UserData>({
    name: '',
    email: '',
    image: null,
    isEmailVerified: false,
    hasGoogleConnection: false,
  });

  // Modal State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Loading States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsProfileLoading(true);

      const userData: UserData = {
        name: session?.user.name || '',
        email: session?.user.email || '',
        image: session?.user.image || '',
        isEmailVerified: session?.user.isEmailVerified || false,
        hasGoogleConnection: false,
      };

      setUserData(userData);
      setProfileFormData(userData);
      setIsProfileLoading(false);
    };

    fetchUserData();
  }, [session]);

  // Profile Management Handlers
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileFormData({ ...userData });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileFormData({ ...userData });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    // Prepare data for API call
    const updateData = {
      name: profileFormData.name,
      email: profileFormData.email,
      image: profileFormData.image,
    };

    await fetch('/api/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {
        'Content-type': 'application/json',
      },
    });

    // Update local state
    setUserData({ ...profileFormData });
    setIsEditingProfile(false);
    setIsProfileLoading(false);

    toast.success('Profile Updated');
  };

  const handleImageUploadSuccess = (url: string) => {
    setProfileFormData((prev) => ({ ...prev, image: url }));
    toast.info('Image uploaded. Click "Save Changes" to apply.');
  };

  const handleVerificationSuccess = () => {
    setUserData((prev) => ({ ...prev, isEmailVerified: true }));
    // Update session data
    update();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast('Password Too Short');
      return;
    }

    setIsPasswordLoading(true);

    if (!showOtpInput) {
      // First step: Send OTP
      const otpRequestData = {
        email: userData.email,
        newPassword: passwordData.newPassword,
      };

      const res = await fetch('/api/auth/reset-password', {
        method: 'PATCH',
        body: JSON.stringify(otpRequestData),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const resData = (await res.json()) as Response;

      if (!res.ok) {
        toast.error(resData.message);
      } else {
        toast.success(resData.message);
      }

      setShowOtpInput(true);
      setIsPasswordLoading(false);
    } else {
      // Second step: Verify OTP and update password
      const passwordUpdateData = {
        email: userData.email,
        newPassword: passwordData.newPassword,
        otp: passwordData.otp,
      };

      const res = await fetch('/api/auth/reset-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify(passwordUpdateData),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const resData = (await res.json()) as Response;

      if (!res.ok) {
        toast.error(resData.message);
      } else {
        toast.success(resData.message);
        // Optionally, reset form and state
        setPasswordData({ newPassword: '', confirmPassword: '', otp: '' });
        setShowOtpInput(false);
      }
      setIsPasswordLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-4xl mx-auto space-y-8 mb-8 p-4">
      {/* Profile Management Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl sm:text-2xl">Profile Management</CardTitle>
          </div>
          <CardDescription className="text-sm">
            All your profile settings, at one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                {profileFormData.image && profileFormData.image.includes('res.cloudinary.com') ? (
                  <CldImage
                    src={profileFormData.image}
                    alt="Profile"
                    width={1200}
                    height={1200}
                    crop="thumb"
                    gravity="face"
                  />
                ) : (
                  <AvatarImage
                    src={profileFormData.image || undefined}
                    alt="Profile"
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="text-lg">
                  {profileFormData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {isEditingProfile && (
                <div className="flex flex-col gap-2">
                  <AvatarUploader onUploadSuccess={handleImageUploadSuccess} />
                  <p className="text-xs text-muted-foreground">Upload a new profile picture.</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid gap-4 sm:gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileFormData.name}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-muted' : ''}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={(e) =>
                    setProfileFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className={!isEditingProfile ? 'bg-muted' : ''}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!isEditingProfile ? (
                <Button
                  type="button"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={isProfileLoading}
                    className="flex items-center gap-2"
                  >
                    {isProfileLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isProfileLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Management Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl sm:text-2xl">Account Management</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Manage verification status&nbsp;
            {session?.user.provider === 'credentials' && 'and update your password'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Verification Status */}
          <div
            className={`space-y-4 p-4 rounded-lg border transition-all duration-200 ${
              userData.isEmailVerified
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
            }`}
          >
            <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {userData.isEmailVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  <h3 className="font-medium">Verification Status</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userData.isEmailVerified
                    ? 'Your account is verified and you can access all features.'
                    : 'Verify your account to unlock additional features and functionality.'}
                </p>
              </div>
              {userData.isEmailVerified && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {!userData.isEmailVerified && (
              <Button
                variant="outline"
                onClick={() => setIsVerificationModalOpen(true)}
                className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
              >
                <Mail className="h-4 w-4" />
                Verify Account
              </Button>
            )}
          </div>
          {/* Update Password */}
          {session?.user.provider === 'credentials' && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Update Password
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password with email verification
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  {showOtpInput && (
                    <div className="grid gap-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        value={passwordData.otp}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, otp: e.target.value }))
                        }
                        placeholder="Enter 6-digit code from email"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Check your email for the verification code
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="flex items-center gap-2"
                  >
                    {isPasswordLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {isPasswordLoading
                      ? showOtpInput
                        ? 'Verifying...'
                        : 'Sending OTP...'
                      : showOtpInput
                        ? 'Verify & Update Password'
                        : 'Update Password'}
                  </Button>
                </form>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </main>
  );
};

export default UserDetailsPage;
