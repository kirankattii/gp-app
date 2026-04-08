import { DialogTitle } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { X } from "lucide-react";
import React, { type ReactNode, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useScreenView from "@/hooks/useScreenView";

type Props = {
  children: ReactNode;
  show: boolean;
  callback?: (a: { action: string; data: any }) => void;
  className?: string;
  backdropDismiss?: boolean;
  isAutoHeight?: boolean;
  disableSwipe?: boolean;
};

type TitleProps = {
  children: ReactNode;
  onClose: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  toolbarClassName?: string;
  hideCloseButton?: boolean;
};

type HeaderProps = {
  children: ReactNode;
  className?: string;
};

type ContentProps = {
  children: ReactNode;
  className?: string;
};

function AppModal({
  children,
  show = false,
  callback,
  className = "",
  backdropDismiss = true,
  isAutoHeight = false,
  disableSwipe = false,
}: Props) {
  const { isMobile } = useScreenView();

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!backdropDismiss && !open) return;

      if (!open && callback) {
        callback({ action: "close", data: {} });
      }
    },
    [callback, backdropDismiss]
  );

  // Mobile → Drawer
  if (isMobile) {
    return (
      <Drawer
        open={show}
        onOpenChange={onOpenChange}
        dismissible={!disableSwipe}
      >
        <DrawerContent
          className={clsx(
            "flex flex-col rounded-t-2xl bg-[var(--gp-cream)] shadow-lg",
            isAutoHeight ? "max-h-[90vh]" : "",
            className
          )}
        >
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop → Dialog
  return (
    <Dialog open={show} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx(
          "flex flex-col rounded-xl bg-[var(--gp-cream)] p-0 shadow-xl border border-[var(--gp-beige)]",
          isAutoHeight ? "max-h-[85vh]" : "",
          className
        )}
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------- HEADER -------------------- */

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const { isMobile } = useScreenView();

  if (isMobile) {
    return (
      <DrawerHeader
        className={clsx(
          "px-4 py-3 border-b border-[var(--gp-beige)] bg-[var(--gp-cream)]",
          className
        )}
      >
        {children}
      </DrawerHeader>
    );
  }

  return (
    <DialogHeader
      className={clsx(
        "px-5 py-4 border-b border-[var(--gp-beige)] bg-[var(--gp-cream)]",
        className
      )}
    >
      {children}
    </DialogHeader>
  );
};

/* -------------------- TITLE -------------------- */

const Title: React.FC<TitleProps> = ({
  children,
  onClose,
  toolbarClassName = "",
  hideCloseButton = false,
}) => {
  const { isMobile } = useScreenView();

  const CloseBtn = () =>
    !hideCloseButton ? (
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-[var(--gp-light-green)]"
      >
        <X className="size-5 text-[var(--gp-black)]" />
      </Button>
    ) : null;

  if (isMobile) {
    return (
      <DrawerHeader
        className={clsx(
          "px-4 py-4 flex items-center justify-between bg-[var(--gp-cream)] border-b border-[var(--gp-beige)]",
          toolbarClassName
        )}
      >
        <DrawerTitle className="text-lg font-semibold text-[var(--gp-black)]">
          {children}
        </DrawerTitle>
        <CloseBtn />
      </DrawerHeader>
    );
  }

  return (
    <DialogHeader
      className={clsx(
        "px-5 py-4 flex items-center justify-between bg-[var(--gp-cream)] border-b border-[var(--gp-beige)]",
        toolbarClassName
      )}
    >
      <DialogTitle className="text-xl font-semibold text-[var(--gp-black)]">
        {children}
      </DialogTitle>
      <CloseBtn />
    </DialogHeader>
  );
};

/* -------------------- CONTENT -------------------- */

const Content: React.FC<ContentProps> = ({ children, className }) => {
  return (
    <div className={clsx("flex-1 overflow-y-auto px-5 py-4", className)}>
      {children}
    </div>
  );
};

/* -------------------- FOOTER -------------------- */

const Footer: React.FC<ContentProps> = ({ children, className }) => {
  const { isMobile } = useScreenView();

  if (isMobile) {
    return (
      <DrawerFooter
        className={clsx(
          "p-4 flex justify-end border-t border-[var(--gp-beige)] bg-[var(--gp-cream)]",
          className
        )}
      >
        {children}
      </DrawerFooter>
    );
  }

  return (
    <DialogFooter
      className={clsx(
        "p-4 flex justify-end border-t border-[var(--gp-beige)] bg-[var(--gp-cream)]",
        className
      )}
    >
      {children}
    </DialogFooter>
  );
};

/* Attach subcomponents -------------------------------- */

AppModal.Header = Header;
AppModal.Title = Title;
AppModal.Content = Content;
AppModal.Footer = Footer;

export default AppModal;