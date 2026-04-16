import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, className }) => {
  return (
    <header className={cn(
      "flex h-16 items-center justify-between gap-4 border-b border-zinc-50 px-6 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20",
      className
    )}>
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-10 w-10 text-zinc-500 hover:text-[var(--gp-green)] transition-all hover:bg-[var(--gp-green)]/5" />
        {title && (
          <>
            <div className="h-6 w-px bg-zinc-200 hidden md:block" />
            <h1 className="text-lg font-bold text-zinc-800 tracking-tight hidden md:block">
              {title}
            </h1>
          </>
        )}
        
        {/* Search Bar - Mirrored from old layout */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-100/50">
          <Search className="w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search store..." 
            className="text-xs bg-transparent border-none outline-none text-zinc-600 placeholder:text-zinc-400 placeholder:font-medium w-40"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-[var(--gp-green)] rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-px bg-zinc-200 mx-1" />
        
        {/* Store Status Toggle - Mirrored from old layout */}
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-all group">
          <span className="text-xs font-bold text-zinc-700 hidden sm:block">Store Status</span>
          <div className="h-6 w-12 bg-[var(--gp-green)] rounded-full flex items-center px-1 shadow-inner shadow-black/10">
            <div className="h-4 w-4 bg-white rounded-full shadow-sm ml-auto" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
