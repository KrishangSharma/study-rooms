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
