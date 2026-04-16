import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SideMenu from "@/components/core/sidemenu/SideMenu";
import AppHeader from "@/components/core/header/AppHeader";

export default function SellerSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[var(--gp-beige)] selection:bg-[var(--gp-green)]/10">
        <SideMenu />
        <SidebarInset className="bg-white md:m-2 md:rounded-3xl md:shadow-xl md:shadow-zinc-900/5 overflow-hidden flex flex-col border border-zinc-100">
           <AppHeader title="Seller Dashboard" />

           <main className="flex-1 overflow-y-auto bg-zinc-50/30">
              {children}
           </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
