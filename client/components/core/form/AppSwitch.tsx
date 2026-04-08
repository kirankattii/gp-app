import { Switch } from "@/components/ui/switch";

interface AppSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  size?: "sm" | "md";
  error?: string;
  className?: string;
  disabled?: boolean;
}

const AppSwitch = ({
  checked,
  onCheckedChange,
  label,
  size = "sm",
  error,
  className,
  disabled = false,
}: AppSwitchProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="data-[state=checked]:bg-gp-green"
        />
        {label && (
          <span
            className={
              size === "sm"
                ? "text-xs font-medium text-gp-black"
                : "text-sm font-medium text-gp-black"
            }
          >
            {label}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default AppSwitch;