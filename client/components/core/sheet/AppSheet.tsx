"use client";

import React, { ReactNode, useCallback } from "react";
import clsx from "clsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface AppSheetProps {
  children: ReactNode;
  show: boolean;
  callback?: (r: { action: string; data: any }) => void;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  isAutoHeight?: boolean;
}

function AppSheet({
  children,
  show,
  callback,
  side = "right",
  className,
  isAutoHeight = false,
}: AppSheetProps) {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && callback) {
        callback({ action: "close", data: {} });
      }
    },
    [callback]
  );

  return (
    <Sheet open={show} onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        className={clsx(
          "p-0 bg-white border-l border-[var(--gp-border)]",
          "min-w-[340px] md:min-w-[420px]",
          isAutoHeight && "h-auto",
          className
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------- CHILD COMPONENTS -------------------- */

const Header = ({
  children,
  className,
  showCloseBtn,
  onClose,
}: {
  children: ReactNode;
  className?: string;
  showCloseBtn?: boolean;
  onClose?: () => void;
}) => (
  <SheetHeader
    className={clsx(
      "sticky top-0 z-20 bg-white p-4 border-b border-[var(--gp-border)]",
      className
    )}
  >
    <div className="flex justify-between items-center">
      {children}
      {showCloseBtn && (
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          ×
        </button>
      )}
    </div>
  </SheetHeader>
);

const Title = ({
  children,
  onClose,
  hideCloseBtn,
}: {
  children: ReactNode;
  onClose: () => void;
  hideCloseBtn?: boolean;
}) => (
  <SheetHeader className="sticky top-0 z-20 bg-white p-4 border-b border-[var(--gp-border)]">
    <SheetTitle className="flex justify-between items-center text-lg font-semibold text-[var(--gp-text)]">
      {children}
      {!hideCloseBtn && (
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          ×
        </button>
      )}
    </SheetTitle>
  </SheetHeader>
);

const Content = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={clsx("flex-1 overflow-auto p-4", className)}>
    {children}
  </div>
);

const Footer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <SheetFooter className={clsx("p-4 border-t border-[var(--gp-border)]", className)}>
    {children}
  </SheetFooter>
);

/* Attach components */
AppSheet.Header = Header;
AppSheet.Title = Title;
AppSheet.Content = Content;
AppSheet.Footer = Footer;

export default AppSheet;