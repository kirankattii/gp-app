import clsx from "clsx";
import type { RegisterOptions } from "react-hook-form";
import InpLabel from "./AppLabel";

interface AppSelectOption {
  value: string | number;
  label: string;
}

interface AppSelectOptionGroup {
  label: string;
  options: AppSelectOption[];
}

interface AppSelectGroupProps {
  name: string;
  label?: string;
  options: AppSelectOptionGroup[];
  register: any;
  rules?: RegisterOptions;
  error?: string;
  className?: string;
  size?: "sm" | "lg";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  isRequired?: boolean;
}

export const AppSelectGroup = ({
  name,
  label,
  options,
  register,
  rules,
  error,
  className,
  size = "sm",
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled,
  isRequired,
}: AppSelectGroupProps) => {
  const {
    onChange: registerOnChange,
    onBlur: registerOnBlur,
    ...registerRest
  } = register(name, rules);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    registerOnChange(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    registerOnBlur(e);
    onBlur?.(e);
  };

  return (
    <div className={className}>
      {label && (
        <InpLabel size={size} isRequired={isRequired}>
          {label}
        </InpLabel>
      )}

      <select
        {...registerRest}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={onFocus}
        className={clsx(
          "w-full border rounded-md border-border px-3 outline-none bg-white",
          "focus:ring-2 focus:ring-gp-green/20 focus:border-gp-green transition-all duration-300",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          size === "sm" ? "h-10 text-sm" : "h-12 text-base"
        )}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((group, gx) => (
          <optgroup key={gx} label={group.label}>
            {group.options.map((opt, ix) => (
              <option key={ix} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default AppSelectGroup;