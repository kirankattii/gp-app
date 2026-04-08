import clsx from "clsx";
import { Info } from "lucide-react";
import AppPopover from "../popover/AppPopover";

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
        "flex items-center gap-1 mb-1 font-medium text-[var(--gp-black)]",
        size === "sm" ? "text-xs" : "text-sm",
        labelClassName
      )}
    >
      {children}

      {isRequired && <span className="text-red-500">*</span>}

      {note && (
        <AppPopover
          triggerContent={
            <button className="cursor-pointer text-gray-500">
              <Info size={12} />
            </button>
          }
        >
          {note}
        </AppPopover>
      )}
    </label>
  );
};

export default InpLabel;