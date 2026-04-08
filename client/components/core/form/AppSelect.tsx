import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InpLabel from "./AppLabel";
import AppSpinner from "../Spinner/AppSpinner";
import clsx from "clsx";

interface AppSelectProps {
  label?: string;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  error?: string;
  className?: string;
  size?: "sm" | "lg";
  placeholder?: string;
  onChange?: (value: string) => void;
  isRequired?: boolean;
  disabled?: boolean;
  inputClassName?: string;
  value?: string | undefined;
  loading?: boolean;
}

export const AppSelect = ({
  label,
  options,
  error,
  className,
  size = "sm",
  placeholder,
  onChange,
  isRequired,
  disabled,
  inputClassName,
  value,
  loading,
}: AppSelectProps) => {

  if (loading) {
    return (
      <div className={className}>
        {label && (
          <InpLabel size={size} isRequired={isRequired}>
            {label}
          </InpLabel>
        )}
        <div className="h-10 flex items-center">
          <AppSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <InpLabel size={size} isRequired={isRequired}>
          {label}
        </InpLabel>
      )}

      <Select onValueChange={onChange} disabled={disabled} value={value}>
        <SelectTrigger
          className={clsx(
            "w-full border-border focus:ring-gp-green/20 focus:border-gp-green transition-all duration-300",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            size === "sm" && "h-10 text-sm",
            size === "lg" && "h-12 text-base",
            inputClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt, idx) => (
            <SelectItem key={idx} value={opt.value.toString()}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default AppSelect;