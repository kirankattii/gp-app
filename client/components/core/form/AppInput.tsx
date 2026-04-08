import clsx from "clsx";
import type { RegisterOptions } from "react-hook-form";
import { Input } from "@/components/ui/input";
import InpLabel from "./AppLabel";

interface AppInputProps {
  name: string;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  register: any;
  rules?: RegisterOptions;
  error?: string;
  className?: string;
  size?: "sm" | "lg";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  autoFocus?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  note?: React.ReactNode;
}

export const AppInput = ({
  name,
  label,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  className,
  size = "sm",
  onChange,
  onBlur,
  onFocus,
  onClick,
  disabled = false,
  isRequired,
  maxLength,
  readOnly = false,
  autoFocus = false,
  inputClassName,
  labelClassName,
  leftIcon,
  rightIcon,
  note,
}: AppInputProps) => {
  const {
    onChange: registerOnChange,
    onBlur: registerOnBlur,
    ...registerRest
  } = register(name, {
    ...rules,
    setValueAs:
      type === "number"
        ? (value: string) => {
            if (value === "" || value === null || value === undefined)
              return "";
            const num = Number(value);
            return isNaN(num) ? "" : num;
          }
        : undefined,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle maxLength for number inputs
    if (type === "number" && maxLength) {
      const value = event.target.value;
      if (value.length > maxLength) {
        event.target.value = value.slice(0, maxLength);
      }
    }

    registerOnChange(event);
    onChange?.(event);
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    registerOnBlur(event);
    onBlur?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
  };

  return (
    <div className={className}>
      {label && (
        <InpLabel
          isRequired={isRequired}
          size={size}
          labelClassName={labelClassName}
          note={note}
        >
          {label}
        </InpLabel>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gp-dark/70 pointer-events-none z-10">
            {leftIcon}
          </span>
        )}

        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          readOnly={readOnly}
          maxLength={maxLength}
          autoComplete="off"
          {...registerRest}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onClick={onClick}
          className={clsx(
            "w-full border rounded-md border-border px-3 focus:outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition-all duration-300",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            size === "sm" && "h-10 text-sm",
            size === "lg" && "h-12 text-base",
            inputClassName
          )}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gp-dark/70 z-10">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};
