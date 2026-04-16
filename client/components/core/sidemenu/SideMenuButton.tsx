import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/app/types/CommonTypes";

type SideMenuButtonProps = {
  item: MenuItem;
  className?: string;
  onToggle?: () => void;
  isExpanded?: boolean;
};

const SideMenuButton: React.FC<SideMenuButtonProps> = ({
  item,
  className,
  onToggle,
  isExpanded,
}) => {
  const pathname = usePathname();
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path ? pathname.startsWith(item.path) : false;

  const renderIcon = () => {
    return Icon ? (
      <Icon 
        size={18} 
        className={cn(
          "transition-colors",
          isActive ? "text-white" : "text-zinc-400 group-hover:text-gp-green"
        )} 
      />
    ) : null;
  };

  return (
    <SidebarMenuItem className={cn("px-2", className)}>
      <SidebarMenuButton
        asChild={!!item.path && !hasChildren}
        onClick={hasChildren ? onToggle : undefined}
        isActive={isActive}
        className={cn(
          "group w-full h-11 transition-all duration-200 rounded-xl px-3",
          isActive 
            ? "bg-gp-green shadow-lg shadow-gp-green/20 hover:bg-gp-green" 
            : "hover:bg-gp-green/5 bg-transparent"
        )}
      >
        {item.path && !hasChildren ? (
          <Link
            href={item.path}
            className="flex items-center gap-3 w-full no-underline hover:no-underline"
          >
            {renderIcon()}
            <span className={cn(
              "font-bold text-sm transition-colors flex-1",
              isActive ? "text-white" : "text-zinc-600 group-hover:text-gp-green"
            )}>
              {item.label}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-3 w-full cursor-pointer">
            {renderIcon()}
            <span className={cn(
              "font-bold text-sm flex-1",
              isActive ? "text-white" : "text-zinc-600 group-hover:text-gp-green"
            )}>
              {item.label}
            </span>
            {hasChildren && (
              <div className={cn(
                "transition-transform duration-200",
                isExpanded ? "rotate-90" : ""
              )}>
                <ChevronRight className={cn(
                  "w-4 h-4",
                  isActive ? "text-white" : "text-zinc-400"
                )} />
              </div>
            )}
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SideMenuButton;
