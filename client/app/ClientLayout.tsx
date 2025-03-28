"use client";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const hiddenRoutes = ['/', '/login', '/register'];
  const showSidebar = !hiddenRoutes.includes(pathname);
  
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 overflow-hidden p-0 m-0">
      {showSidebar && (
        <Sidebar 
          activePage={pathname.split('/')[1] || 'dashboard'}
          userInitials="PK"
        />
      )}
      <main className="flex-1 h-screen overflow-auto p-0 m-0">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
