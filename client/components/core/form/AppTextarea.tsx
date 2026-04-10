import clsx from "clsx";
import { type RegisterOptions } from "react-hook-form";
import InpLabel from "./AppLabel";

interface AppTextareaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  name: string;
  register: any;
  rules?: RegisterOptions;
  rows?: number;
  isRequired?: boolean;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputClassName?: string;
}

export const AppTextarea = ({
  label,
  placeholder,
  className,
  error,
  name,
  register,
  rules,
  rows = 3,
  isRequired,
  maxLength,
  onChange,
  inputClassName = "",
}: AppTextareaProps) => {
  const { onChange: registerOnChange, ...registerRest } = register(name, rules);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    registerOnChange(event);
    onChange?.(event);
  };

  return (
    <div className={className}>
      {label && (
        <InpLabel isRequired={isRequired} htmlFor={name}>
          {label}
        </InpLabel>
      )}

      <textarea
        id={name}
        placeholder={placeholder}
        className={clsx(
          "w-full outline-none border rounded-md border-gray-300 p-2 placeholder:text-sm text-sm",
          inputClassName
        )}
        onChange={handleChange}
        {...registerRest}
        rows={rows}
        maxLength={maxLength}
      ></textarea>
      {error && (
        <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>
      )}
    </div>
  );
};

export default AppTextarea;