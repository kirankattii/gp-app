"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import clsx from "clsx";

interface AppPopoverProps {
  children: React.ReactNode;
  triggerContent: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  noPadding?: boolean;
  contentClassName?: string;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AppPopover({
  children,
  triggerContent,
  align = "center",
  side = "top",
  sideOffset = 6,
  alignOffset = 0,
  avoidCollisions = true,
  noPadding,
  contentClassName,
  modal = false,
  open,
  onOpenChange,
}: AppPopoverProps) {
  return (
    <Popover modal={modal} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>

      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        className={clsx(
          "rounded-md shadow-md bg-white border border-border",
          noPadding ? "p-0" : "p-3",
          contentClassName
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}