import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea";
import InpLabel from "./AppLabel";
import { useEffect, useRef, useId, useState } from "react";
import type { RegisterOptions } from "react-hook-form";

interface AppTextareaProps {
  label?: string;
  name?: string;
  register?: any;
  rules?: RegisterOptions;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  error?: string | null;
  size?: "sm" | "lg";
  placeholder?: string;
  isRequired?: boolean;
  inputClassName?: string;
  value?: string;
  rows?: number;
  type?: "default" | "autosize";
  maxLength?: number;
  showCounter?: boolean;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const AppTextarea = ({
  label,
  name,
  register,
  rules,
  className,
  value,
  error,
  placeholder,
  isRequired,
  size = "sm",
  inputClassName = "",
  onChange,
  rows = 3,
  type = "default",
  maxLength,
  showCounter = true,
  id,
  disabled = false,
  readOnly = false,
}: AppTextareaProps) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(value ?? "");

  // Sync internal value with prop value when it changes (for controlled component usage)
  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  // Resolve register props if provided
  const { onChange: registerOnChange, ...registerRest } =
    register && name ? register(name, rules) : ({ onChange: undefined } as any);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    registerOnChange?.(e);
    onChange?.(e);
  };

  const currentValue = internalValue;

  // Auto resize logic
  useEffect(() => {
    if (type === "autosize" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [currentValue, type]);

  return (
    <div className={className}>
      {label && (
        <InpLabel size={size} isRequired={isRequired} htmlFor={textareaId}>
          {label}
        </InpLabel>
      )}

      <div className="relative">
        <Textarea
          id={textareaId}
          ref={textareaRef}
          placeholder={placeholder}
          // When using register, let RHF control value via ref; otherwise use controlled value
          value={register && name ? undefined : currentValue}
          onChange={handleChange}
          maxLength={maxLength}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          {...(register && name ? registerRest : {})}
          className={clsx(
            "app-input border rounded-md border-border transition-all duration-300",
            "focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green",
            size === "sm" ? "text-sm py-2 min-h-24" : "text-base py-3 min-h-32",
            inputClassName,
            type === "autosize" && "overflow-hidden resize-none"
          )}
        />

        {/* Word counter */}
        {showCounter && maxLength && (
          <div className="absolute right-2 bottom-1 text-xs text-gray-400">
            {currentValue.length}/{maxLength}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default AppTextarea;