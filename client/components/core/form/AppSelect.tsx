import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InpLabel from "./AppLabel";
import AppSpinner from "../Spinner/AppSpinner";

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
  size,
  placeholder,
  onChange,
  isRequired,
  disabled,
  inputClassName,
  value,
  loading,
}: AppSelectProps) => {
  const handleChange = (val: string) => {
    onChange?.(val);
  };

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
      <Select onValueChange={handleChange} disabled={disabled} value={value}>
        <SelectTrigger
          className={inputClassName}
          size={size === "sm" ? "sm" : "default"}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value?.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>
      )}
    </div>
  );
};

export default AppSelect;