import Footer from '@/components/core/Footer';
import Navbar from '@/components/core/Navbar/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
