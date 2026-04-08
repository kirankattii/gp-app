import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { X } from "lucide-react";
import clsx from "clsx";

interface DatePickerInputProps {
  value?: Date | Date[];
  onChange: (value: any) => void;
  placeholder?: string;
  inputClassName?: string;
  hideClose?: boolean;
  forceClose?: boolean;
  config?: any;
  size?: "sm" | "lg";
}

const DatePickerInput = ({
  value,
  onChange,
  placeholder,
  hideClose = false,
  forceClose = false,
  inputClassName,
  config,
  size = "sm",
}: DatePickerInputProps) => {
  const formatted =
    !value || (Array.isArray(value) && value.length === 0)
      ? ""
      : Array.isArray(value)
      ? value.length === 2
        ? `${format(value[0], "dd MMM yyyy")} - ${format(value[1], "dd MMM yyyy")}`
        : format(value[0], "dd MMM yyyy")
      : format(value, "dd MMM yyyy");
  return (
    <Popover defaultOpen={false} open={forceClose ? false : undefined}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={clsx(
            "w-full border rounded-md text-left px-3 flex items-center justify-between border-gp-dark/20",
            "focus:ring-2 focus:ring-gp-primary",
            size === "sm" ? "h-9 text-sm" : "h-11 text-base",
            inputClassName
          )}
        >
          <span className={formatted ? "text-gp-dark" : "text-gray-500"}>
            {formatted || placeholder || "Select date"}
          </span>

          {!hideClose && formatted && (
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="text-gray-400 hover:text-gp-dark cursor-pointer"
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Calendar
          {...config}
          mode={config?.mode || "single"}
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerInput;