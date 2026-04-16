import React, { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidemenuService from "@/app/services/SidemenuService";
import SideMenuButton from "./SideMenuButton";
import UserProfile from "./UserProfile";
import Rbac from "../rbac/Rbac";

export default function SideMenu() {
  const menuItems = SidemenuService.getSidemenu();
  const settingsItems = SidemenuService.getSellerSettingsMenu();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <Sidebar className="border-r border-zinc-100/50">
      <SidebarHeader className="bg-white/40 px-6 py-6 border-b border-zinc-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gp-green/5 rounded-2xl border border-gp-green/10 shadow-sm">
                <Image 
                    src="/gplogo-nobg.png" 
                    alt="GreenPeddle Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-zinc-800 tracking-tight leading-none">
                GreenPeddle
              </span>
              <span className="text-[10px] font-bold text-gp-green uppercase tracking-widest mt-0.5">
                Seller Hub
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-zinc-50/20 overflow-y-hidden">
        <ScrollArea className="h-[calc(100vh-14rem)] p-2">
          <SidebarMenu>
            <div className="px-4 py-3">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Store Management
               </span>
            </div>
            {menuItems.map((item) => {
              const itemId = item.id || item.label;
              const isExpanded = expandedItems.has(itemId);
              const roles = item.allowed || [];

              return (
                <Rbac key={itemId} roles={roles}>
                  <SideMenuButton
                    item={item}
                    onToggle={() => toggleExpanded(itemId)}
                    isExpanded={isExpanded}
                  />
                  {/* Children rendering logic can be added here if needed */}
                </Rbac>
              );
            })}

            <div className="px-4 py-5 mt-2">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Account Control
               </span>
            </div>
            {settingsItems.map((item) => (
               <Rbac key={item.id || item.label} roles={item.allowed || []}>
                  <SideMenuButton item={item} />
               </Rbac>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="bg-white/40 p-0">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
