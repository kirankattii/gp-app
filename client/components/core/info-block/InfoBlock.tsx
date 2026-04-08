import clsx from "clsx";

interface InfoBlockProps {
  children: React.ReactNode;
  className?: string;
  variant?: "info" | "warning" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
  shadow?: boolean;
}

const InfoBlock = ({
  children,
  className,
  variant = "info",
  size = "md",
  bordered = false,
  shadow = false,
}: InfoBlockProps) => {
  return (
    <div
      className={clsx(
        "rounded-lg p-4",

        /* GP SIZES */
        size === "sm" && "text-sm py-2",
        size === "md" && "text-base py-3",
        size === "lg" && "text-lg py-4",

        /* GP BRAND VARIANTS */
        variant === "info" && "bg-[var(--gp-light-green)] text-[var(--gp-brown)]",
        variant === "warning" && "bg-[#FFF4E5] text-[#BB6B00]",
        variant === "success" && "bg-[var(--gp-light-green)] text-[var(--gp-green)]",
        variant === "danger" && "bg-red-50 text-red-700",

        /* BORDERS */
        bordered &&
          variant === "info" &&
          "border border-[color-mix(in_oklch,var(--gp-brown)_50%,white)]",
        bordered &&
          variant === "warning" &&
          "border border-[#D48806]",
        bordered &&
          variant === "success" &&
          "border border-[color-mix(in_oklch,var(--gp-green)_55%,white)]",
        bordered &&
          variant === "danger" &&
          "border border-red-400",

        /* SHADOW */
        shadow && "shadow-sm",

        className
      )}
    >
      {children}
    </div>
  );
};

export default InfoBlock;