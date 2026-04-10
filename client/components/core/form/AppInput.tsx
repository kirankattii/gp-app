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
  inputClassName?: string;
  labelClassName?: string;
  autoFocus?: boolean;
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
  size,
  onChange,
  onBlur,
  onFocus,
  onClick,
  disabled = false,
  isRequired,
  maxLength,
  readOnly = false,
  inputClassName,
  labelClassName,
  autoFocus = false,
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
        return;
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onClick={onClick}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete="off"
          maxLength={maxLength}
          autoFocus={autoFocus}
          {...registerRest}
          className={clsx(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            inputClassName,
            size === "sm" && "h-8 text-sm",
            size === "lg" && "h-10 text-base"
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-1 font-medium">{error}</div>
      )}
    </div>
  );
};
