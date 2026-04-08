import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

interface AppCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  shadow?: boolean;
  border?: boolean;
}

export function AppCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  shadow = false,
  border = true,
}: AppCardProps) {
  return (
    <Card
      className={clsx(
        border && "border border-[var(--gp-border)]",
        shadow && "shadow-sm",
        "rounded-lg bg-white",
        className
      )}
    >
      {(title || description) && (
        <CardHeader className={headerClassName}>
          {title && <CardTitle className="text-[var(--gp-black)]">{title}</CardTitle>}
          {description && (
            <p className="text-sm text-zinc-500 font-medium opacity-80">{description}</p>
          )}
        </CardHeader>
      )}

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export default AppCard;