"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {!isLoginPage && <Sidebar />}
        <main
          className={cn(
            "flex-1 min-h-screen flex flex-col max-w-full transition-all duration-300",
            !isLoginPage ? "lg:pl-[260px]" : "lg:pl-0"
          )}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
