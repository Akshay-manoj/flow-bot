"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  MessageSquare,
  Users,
  Radio,
  BarChart3,
  Blocks,
  Settings,
  Bot
} from "lucide-react";
import { useSidebar } from "../lib/sidebar-context";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  // If we are on the login or landing page, we don't render the sidebar
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Flow Builder", href: "/flows", icon: GitFork },
    { name: "Live Chat", href: "/conversations", icon: MessageSquare },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Channels", href: "/channels", icon: Radio },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Integrations", href: "/integrations", icon: Blocks },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in cursor-pointer"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[260px] bg-slate-900 border-r border-slate-800/60 flex flex-col py-6 px-4 z-50 text-slate-300 select-none transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 mb-8 px-2 select-none">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
            <Bot className="w-6 h-6 text-primary-fixed" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">FlowBot</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">v2.4.0</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "text-white bg-slate-800/80 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r" />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-primary-fixed" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Details */}
        <div className="mt-auto pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-2">
            <div className="relative shrink-0">
              <img
                className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHuRiy167HhHmljry09ERSNW6J_A-QgXUsil487TArTtfxyxILBdZLhkh8Fp5B4WolJdp5ov8kaxKPsxTVVEoWKAqc0Ul-bNspH75VHkRedYut3ZoaEHMJjDzSIPLe7MJzg5yAIrDaTgzPYVQ6fc4R7-hHnGictI7uZTZkhhYCOgvCOrVzy8JUfjhtOv9eIxoJXICdD2Rg4jHJPhtKTcy7571cm6t-LJiw6eIUZliBlc-KjvAguHPyew"
                alt="User avatar"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-slate-900 rounded-full" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Alex Rivers</p>
              <p className="text-[10px] text-slate-500 font-semibold truncate">Premium Account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

