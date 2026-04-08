"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type GPButtonColor =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "neutral";

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  color?: GPButtonColor;
  variant?: "solid" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function AppButton({
  children,
  onClick,
  type = "button",
  size = "md",
  color = "primary",
  variant = "solid",
  className,
  loading = false,
  disabled,
  fullWidth,
}: AppButtonProps) {
  const colorMap: Record<GPButtonColor, string> = {
    primary: "bg-gp-green text-white hover:bg-gp-green-hover border-transparent shadow-[0_4px_14px_0_rgba(41,93,48,0.39)]",
    success: "bg-gp-success text-white hover:bg-gp-success/90 border-transparent",
    danger: "bg-gp-error text-white hover:bg-gp-error/90 border-transparent",
    warning: "bg-gp-warning text-white hover:bg-gp-warning/90 border-transparent",
    neutral: "bg-gray-600 text-white hover:bg-gray-700 border-transparent",
  };

  const outlineMap: Record<GPButtonColor, string> = {
    primary:
      "border-gp-green text-gp-green hover:bg-gp-green hover:text-white",
    success:
      "border-gp-success text-gp-success hover:bg-gp-success hover:text-white",
    danger: "border-gp-error text-gp-error hover:bg-gp-error hover:text-white",
    warning:
      "border-gp-warning text-gp-warning hover:bg-gp-warning hover:text-white",
    neutral:
      "border-gray-400 text-gray-700 hover:bg-gray-700 hover:text-white",
  };

  const ghostMap: Record<GPButtonColor, string> = {
    primary: "text-gp-green hover:bg-gp-green-light/10",
    success: "text-gp-success hover:bg-gp-success-soft",
    danger: "text-gp-error hover:bg-gp-error-soft",
    warning: "text-gp-warning hover:bg-gp-warning-soft",
    neutral: "text-gray-700 hover:bg-gray-100",
  };

  const sizeMap = {
    xs: "h-7 text-xs px-2.5",
    sm: "h-9 text-sm px-3",
    md: "h-10 text-sm px-4",
    lg: "h-12 text-base px-6",
    xl: "h-14 text-lg px-8",
  };

  const variantMap: Record<NonNullable<AppButtonProps["variant"]>, any> = {
    solid: "default",
    outline: "outline",
    ghost: "ghost",
  };

  const computedClass =
    variant === "outline"
      ? outlineMap[color]
      : variant === "ghost"
      ? ghostMap[color]
      : colorMap[color];

  return (
    <Button
      type={type}
      variant={variantMap[variant]}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "rounded-md cursor-pointer font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
        sizeMap[size],
        fullWidth && "w-full",
        computedClass,
        className
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
      {children}
    </Button>
  );
}

export default AppButton;