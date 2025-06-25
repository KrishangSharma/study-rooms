'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
import { Loader2, Trash2, AlertTriangle, Shield, X, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Response {
  message?: string;
}

const AccountDeletionPage = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationChecks, setConfirmationChecks] = useState({
    dataLoss: false,
    irreversible: false,
    finalConfirm: false,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const allChecksConfirmed = Object.values(confirmationChecks).every(Boolean);

  const handleCheckboxChange = (key: keyof typeof confirmationChecks) => {
    setConfirmationChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteButtonClick = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDeletion = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      const data = (await res.json()) as Response;

      if (res.ok) {
        toast.success('Account deleted successfully. You will be signed out shortly.');
        setShowConfirmationModal(false);

        // Sign out user after a brief delay
        setTimeout(async () => {
          await signOut({ callbackUrl: '/' });
        }, 2000);
      } else {
        toast.error(data.message || 'Error deleting account');
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      {/* Confirmation Modal */}
      <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-xl text-destructive">Final Confirmation</DialogTitle>
                <DialogDescription className="text-sm">
                  This is your last chance to cancel account deletion
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDeletion}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Cancel, Keep My Account
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeletion}
              disabled={isDeleting}
              className="flex items-center gap-2 border border-destructive text-destructive bg-transparent hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Yes, Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="w-full max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
        {/* Warning Alert */}
        <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Danger Zone</AlertTitle>
          <AlertDescription>
            Account deletion is permanent and cannot be undone. Please read all information
            carefully before proceeding.
          </AlertDescription>
        </Alert>

        {/* Account Deletion Section */}
        <Card className="border-destructive/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <CardTitle className="text-xl sm:text-2xl text-destructive">Delete Account</CardTitle>
              <Badge variant="destructive" className="ml-auto">
                Irreversible
              </Badge>
            </div>
            <CardDescription className="text-sm">
              Permanently delete your account and all associated data from our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What happens section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                What happens when you delete your account?
              </h3>

              <div className="grid gap-3 pl-6">
                <div className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      All personal data will be permanently deleted
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Including your profile, settings, preferences, and account information
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      All rooms and associated data will be removed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Any rooms you've created or participated in will lose your data
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">OAuth connections will be revoked</p>
                    <p className="text-xs text-muted-foreground">
                      All connected third-party accounts will be disconnected
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">You will be immediately signed out</p>
                    <p className="text-xs text-muted-foreground">
                      Your session will be terminated and you'll be redirected to the homepage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Confirmation checkboxes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Confirmation Required</h3>
              <p className="text-sm text-muted-foreground">
                Please confirm that you understand the consequences of deleting your account:
              </p>

              <div className="space-y-4 pl-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="data-loss"
                    checked={confirmationChecks.dataLoss}
                    onCheckedChange={() => handleCheckboxChange('dataLoss')}
                    className="mt-0.5"
                  />
                  <label htmlFor="data-loss" className="text-sm leading-relaxed cursor-pointer">
                    I understand that all my personal data, rooms, and settings will be permanently
                    deleted
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="irreversible"
                    checked={confirmationChecks.irreversible}
                    onCheckedChange={() => handleCheckboxChange('irreversible')}
                    className="mt-0.5"
                  />
                  <label htmlFor="irreversible" className="text-sm leading-relaxed cursor-pointer">
                    I understand that this action is irreversible and cannot be undone
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="final-confirm"
                    checked={confirmationChecks.finalConfirm}
                    onCheckedChange={() => handleCheckboxChange('finalConfirm')}
                    className="mt-0.5"
                  />
                  <label htmlFor="final-confirm" className="text-sm leading-relaxed cursor-pointer">
                    I want to permanently delete my account and all associated data
                  </label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Delete button */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ready to delete your account?</p>
                  <p className="text-xs text-muted-foreground">
                    This action will take effect immediately and cannot be reversed.
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleDeleteButtonClick}
                  disabled={!allChecksConfirmed}
                  className="flex items-center gap-2 min-w-[200px] justify-center text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </Button>
              </div>

              {!allChecksConfirmed && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Please confirm all checkboxes above to enable account deletion
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alternative actions */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Alternative Options
            </CardTitle>
            <CardDescription>
              Consider these alternatives before permanently deleting your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Temporarily Deactivate</h4>
                <p className="text-xs text-muted-foreground">
                  Hide your profile and data without permanent deletion
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Download Your Data</h4>
                <p className="text-xs text-muted-foreground">
                  Export your personal data before deletion
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </main>
    </>
  );
};

export default AccountDeletionPage;
