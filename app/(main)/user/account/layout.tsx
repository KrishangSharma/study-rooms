import Sidebar from '@/components/core/UserSidebar/Sidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen flex items-start gap-5">
      <aside className="w-1/6 h-[calc(100vh-81px)] border-r sticky top-[81px]">
        <Sidebar />
      </aside>
      <main className="w-3/4">{children}</main>
    </div>
  );
}
