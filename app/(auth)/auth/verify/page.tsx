import VerifyForm from '@/components/core/forms/verifyForm';

// Server Component
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const email = (resolvedParams.email as string) || '';

  return <VerifyForm email={email} />;
}
