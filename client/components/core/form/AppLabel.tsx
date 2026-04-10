import clsx from "clsx";
import AppPopover from "../popover/AppPopover";
import { Info } from "lucide-react";

interface InpLabelProps {
  children: React.ReactNode;
  size?: "sm" | "lg";
  isRequired?: boolean;
  labelClassName?: string;
  note?: React.ReactNode;
  htmlFor?: string;
}

const InpLabel = ({
  children,
  size = "sm",
  isRequired = false,
  labelClassName,
  note,
  htmlFor,
}: InpLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "mb-2 font-medium text-gray-800 flex items-center gap-1",
        size === "sm" ? "text-xs" : "text-sm",
        labelClassName
      )}
    >
      {children}
      {isRequired && <span className="text-xs text-red-500">*</span>}
      {note ? (
        <AppPopover
          triggerContent={
            <button className="cursor-pointer text-gray-500 w-auto">
              <Info size={12} />
            </button>
          }
        >
          {note}
        </AppPopover>
      ) : null}
    </label>
  );
};

export default InpLabel;