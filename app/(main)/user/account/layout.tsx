import ProfileNavigation from '@/components/core/ProfileTabs/ProfileTabs';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen">
      <ProfileNavigation />
      <main className="px-2 pt-5 sm-0 container mx-auto">{children}</main>
    </div>
  );
}
