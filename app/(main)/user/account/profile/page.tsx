'use client';

import type React from 'react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PasswordData, UserData } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Edit3, Save, X, Upload, Mail, Lock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUploader } from '@/components/core/AvatarUploader';
import { CldImage } from 'next-cloudinary';

const UserDetailsPage = () => {
  const { data: session, status } = useSession();

  // Profile Management State
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    image: null,
    hasGoogleConnection: false,
  });
  const [profileFormData, setProfileFormData] = useState<UserData>({
    name: '',
    email: '',
    image: null,
    hasGoogleConnection: false,
  });
  // Account Management State
  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsProfileLoading(true);

      const userData: UserData = {
        name: session?.user.name || '',
        email: session?.user.email || '',
        image: session?.user.image || '',
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

    console.log('Profile update data ready to send:', updateData);

    // Simulate API call
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

  // Account Management Handlers
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning("Passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password is too short');
      return;
    }

    setIsPasswordLoading(true);

    if (!showOtpInput) {
      // First step: Send OTP
      const otpRequestData = {
        email: userData.email,
        newPassword: passwordData.newPassword,
      };

      console.log('OTP request data ready to send:', otpRequestData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowOtpInput(true);
      setIsPasswordLoading(false);

      toast.success('OTP Sent');
    } else {
      // Second step: Verify OTP and update password
      const passwordUpdateData = {
        email: userData.email,
        newPassword: passwordData.newPassword,
        otp: passwordData.otp,
      };

      console.log('Password update data ready to send:', passwordUpdateData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setPasswordData({ newPassword: '', confirmPassword: '', otp: '' });
      setShowOtpInput(false);
      setIsPasswordLoading(false);

      toast.success('Password Updated');
    }
  };

  const handleGoogleConnection = async () => {
    setIsConnectingGoogle(true);

    const connectionData = {
      userId: userData.email, // or user ID
      provider: 'google',
    };

    console.log('Google connection data ready to send:', connectionData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUserData((prev) => ({ ...prev, hasGoogleConnection: true }));
    setIsConnectingGoogle(false);

    toast.success('Google Connected');
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
    <main className="w-full max-w-4xl mx-auto space-y-8 mb-8">
      {/* Profile Management Section */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl sm:text-2xl">Profile Management</CardTitle>
          </div>
          <CardDescription className="text-sm">
            All your profile settings, at one place.
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
            Manage OAuth access, and update your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Google Connection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Google Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Google account for easier sign-in
                </p>
              </div>
              {userData.hasGoogleConnection && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Connected
                </Badge>
              )}
            </div>

            {!userData.hasGoogleConnection && (
              <Button
                variant="outline"
                onClick={handleGoogleConnection}
                disabled={isConnectingGoogle}
                className="flex items-center gap-2"
              >
                {isConnectingGoogle ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                )}
                {isConnectingGoogle ? 'Connecting...' : 'Add Google Connection'}
              </Button>
            )}
          </div>

          <Separator />

          {/* Password Update */}
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
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
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
        </CardContent>
      </Card>
    </main>
  );
};

export default UserDetailsPage;
