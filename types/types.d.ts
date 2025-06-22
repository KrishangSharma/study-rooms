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
  hasGoogleConnection: boolean;
}

export interface PasswordData {
  newPassword: string;
  confirmPassword: string;
  otp: string;
}
