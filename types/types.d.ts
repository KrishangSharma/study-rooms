export interface AuthFormProps {
  type: 'signin' | 'signup';
}

export interface Response {
  message: string;
  status: number;
}

export interface Link {
  label: string;
  to: string;
}

export interface UserData {
  name: string;
  email: string;
  image: string | null;
  isEmailVerified: boolean;
  hasGoogleConnection: boolean;
}

export interface PasswordData {
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
}
