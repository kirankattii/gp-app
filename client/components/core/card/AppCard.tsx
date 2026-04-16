import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import clsx from "clsx";
import React from "react";

interface AppCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  shadow?: boolean;
  border?: boolean;
  noShadow?: boolean;
  noPadding?: boolean;
  noContentPadding?: boolean;
  bordered?: boolean;
  icon?: React.ReactNode;
  iconClassName?: string;
}

export function AppCard({
  title,
  subtitle,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  bodyClassName,
  footerClassName,
  footer,
  shadow = false,
  border = true,
  noShadow = false,
  noPadding = false,
  noContentPadding = false,
  bordered = false,
  icon,
  iconClassName = "",
}: AppCardProps) {
  const showHeader = !!(title || subtitle || description);

  return (
    <Card
      className={clsx(
        "rounded-lg bg-white",
        (border || bordered) && "border border-[var(--gp-border)]",
        (shadow && !noShadow) && "shadow-sm",
        noShadow && "shadow-none border-0",
        noPadding && "py-0",
        className
      )}
    >
      {showHeader && (
        <CardHeader className={clsx("pb-2", headerClassName)}>
          <CardTitle className="flex items-center gap-2 text-[var(--gp-black)]">
            {icon && (
              <span className={clsx("shrink-0", iconClassName)}>{icon}</span>
            )}
            {title}
          </CardTitle>
          {(subtitle || description) && (
            <CardDescription className="text-sm text-zinc-500 font-medium">
              {subtitle || description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent
        className={clsx(
          noContentPadding || noPadding ? "p-0" : "",
          bodyClassName,
          contentClassName
        )}
      >
        {children}
      </CardContent>

      {footer && (
        <div className={clsx("border-t border-zinc-100", footerClassName)}>
          {footer}
        </div>
      )}
    </Card>
  );
}

export default AppCard;