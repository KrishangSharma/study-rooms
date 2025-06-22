'use client';

import { useTheme } from 'next-themes';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '../ui/button';
import {
  cloudinaryLightWidgetStyles,
  cloudinaryDarkWidgetStyles,
} from '@/lib/cloudinary-widget-styles';

interface AvatarUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export function AvatarUploader({ onUploadSuccess }: AvatarUploaderProps) {
  const { theme } = useTheme();

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={(result) => {
        if (typeof result.info === 'object' && 'secure_url' in result.info) {
          onUploadSuccess(result.info.secure_url);
        }
      }}
      options={{
        multiple: false,
        sources: ['local', 'google_drive', 'url', 'camera'],
        styles: theme === 'dark' ? cloudinaryDarkWidgetStyles : cloudinaryLightWidgetStyles,
      }}
    >
      {({ open }) => {
        return (
          <Button type="button" variant="outline" onClick={() => open()}>
            Upload Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
