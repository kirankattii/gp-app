import InpLabel from "./AppLabel";
import DatePickerInput from "./DatePickerInput";
import type { DayPickerProps } from "react-day-picker";

interface AppDateInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  dateConfig?: DayPickerProps;
  callback: (dt: Date | Date[]) => void;
  size?: "sm" | "lg";
  value: Date | Date[] | undefined;
  hideClose?: boolean;
  isRequired?: boolean;
  inputClassName?: string;
  forceClose?: boolean;
}

const AppDateInput = ({
  label,
  size = "sm",
  placeholder,
  error,
  className,
  dateConfig,
  callback,
  value,
  hideClose = false,
  isRequired = false,
  inputClassName = "",
  forceClose = false,
}: AppDateInputProps) => {
  return (
    <div className={className}>
      {label && (
        <InpLabel size={size} isRequired={isRequired}>
          {label}
        </InpLabel>
      )}

      <div className="relative">
        <DatePickerInput
          value={value}
          onChange={callback}
          placeholder={placeholder}
          config={dateConfig}
          hideClose={hideClose}
          inputClassName={inputClassName}
          forceClose={forceClose}
          size={size}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default AppDateInput;