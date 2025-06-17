import Navbar from '@/components/core/Navbar/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="w-screen flex items-start gap-5">
        <main className="w-3/4">{children}</main>
      </div>
    </>
  );
}
