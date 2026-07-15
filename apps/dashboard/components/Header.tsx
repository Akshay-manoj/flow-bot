"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ChevronDown,
  Search,
  Bell,
  HelpCircle,
  PlusCircle,
  Sparkles,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../lib/sidebar-context";

interface HeaderProps {
  title?: string;
  onCreateBot?: () => void;
}

export default function Header({ title, onCreateBot }: HeaderProps) {
  const { toggle } = useSidebar();
  const [orgName, setOrgName] = useState("Loading...");

  useEffect(() => {
    setOrgName(localStorage.getItem("flowbot_org_name") || "My Organization");
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 border-b border-slate-100 sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4 lg:gap-6 flex-1">
        {/* Mobile Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer shrink-0"
          onClick={toggle}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Org Switcher with Shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 border border-slate-200/40 rounded-xl transition-all group duration-200 cursor-pointer text-slate-800 font-bold text-xs bg-white outline-none">
              <Building2 className="w-4 h-4 text-primary" />
              <span>{orgName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          } />

          <DropdownMenuContent align="start" className="w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50">
            <DropdownMenuItem className="w-full text-left px-4 py-2 text-xs text-slate-800 hover:bg-slate-50 font-bold flex items-center justify-between cursor-pointer">
              <span>{orgName}</span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full text-left px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 font-medium cursor-pointer">
              Personal Space
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-t border-slate-100 my-1.5" />
            <DropdownMenuItem className="w-full text-left px-4 py-2 text-xs text-primary hover:bg-slate-50 flex items-center gap-2 font-bold cursor-pointer">
              <PlusCircle className="w-4 h-4" /> Create Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="hidden md:block relative w-full max-w-sm ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full bg-slate-50 border border-slate-200/50 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-slate-400"
            placeholder="Quick search (flows, users, logs)..."
            type="text"
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors relative shrink-0"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-white"></span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex w-9 h-9 items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
        <div className="hidden sm:block h-6 w-[1px] bg-slate-200/60 mx-1"></div>
        <Button
          onClick={onCreateBot || (() => alert("Trigger bot builder wizard..."))}
          className="bg-primary text-on-primary px-3 sm:px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 cursor-pointer h-9 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Bot</span>
        </Button>
      </div>

    </header>
  );
}
