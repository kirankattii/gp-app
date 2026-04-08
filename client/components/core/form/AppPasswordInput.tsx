import { useState } from "react";
import clsx from "clsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { RegisterOptions } from "react-hook-form";
import InpLabel from "./AppLabel";

interface AppPasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  register: any;
  rules?: RegisterOptions;
  error?: string;
  className?: string;
  size?: "sm" | "lg";
  disabled?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  autoFocus?: boolean;
  leftIcon?: React.ReactNode;
}

export const AppPasswordInput = ({
  name,
  label,
  placeholder,
  register,
  rules,
  error,
  className,
  size = "sm",
  disabled = false,
  isRequired,
  maxLength,
  readOnly = false,
  autoFocus = false,
  leftIcon,
}: AppPasswordInputProps) => {
  const [show, setShow] = useState(false);

  const {
    onChange: registerOnChange,
    onBlur: registerOnBlur,
    onFocus: registerOnFocus,
    ...registerRest
  } = register(name, rules);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    registerOnChange(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    registerOnBlur(event);
  };

  return (
    <div className={className}>
      {label && (
        <InpLabel isRequired={isRequired} size={size}>
          {label}
        </InpLabel>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
            {leftIcon}
          </div>
        )}
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          autoComplete="off"
          maxLength={maxLength}
          {...registerRest}
          onChange={handleChange}
          onBlur={handleBlur}
          className={clsx(
            "w-full border rounded-md border-border px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition-all duration-300",
            leftIcon && "pl-10",
            size === "sm" && "h-10 text-sm",
            size === "lg" && "h-12 text-base"
          )}
        />

        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-y-0 right-3 flex items-center hover:opacity-80 transition-opacity"
          onClick={() => setShow((p) => !p)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOffIcon className="size-4 text-zinc-500" />
          ) : (
            <EyeIcon className="size-4 text-zinc-500" />
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};