import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import type { RegisterOptions } from "react-hook-form";

interface AppCheckboxProps {
  name?: string;
  label: string | React.ReactNode;
  error?: string;
  className?: string;
  size?: "xs" | "sm" | "lg";
  // Controlled mode
  onChange?: (checked: boolean) => void;
  value?: boolean;
  // RHF register mode
  register?: any;
  rules?: RegisterOptions;
}

export const AppCheckbox = ({
  name,
  label,
  error,
  className,
  size = "sm",
  onChange,
  value,
  register,
  rules,
}: AppCheckboxProps) => {
  const labelSizeClass =
    size === "xs" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  // When register is provided, bind directly to RHF
  const registerProps = register && name ? register(name, rules) : {};

  return (
    <div className={clsx(className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          {...(register && name
            ? {
                onCheckedChange: (checked) => {
                  registerProps.onChange?.({
                    target: { name, value: checked === true },
                  });
                  onChange?.(checked === true);
                },
              }
            : {
                checked: !!value,
                onCheckedChange: (checked) => onChange?.(checked === true),
              })}
          className={cn(
            "border-border data-[state=checked]:bg-gp-green data-[state=checked]:border-gp-green transition-all duration-300 hover:scale-110"
          )}
        />
        <span className={clsx("text-gp-black", labelSizeClass)}>{label}</span>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};