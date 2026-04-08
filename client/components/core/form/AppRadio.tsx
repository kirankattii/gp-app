import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption {
  value: string | number;
  label: string;
}

interface AppRadioProps {
  defaultValue?: string | number;
  value?: string;
  name: string;
  options: RadioOption[];
  className?: string;
  inline?: boolean;
  onChange?: (value: string) => void;
  error?: string;
}

export const AppRadio = ({
  defaultValue,
  value,
  name,
  options,
  className,
  inline = false,
  onChange,
  error,
}: AppRadioProps) => {
  return (
    <div className={className}>
      <RadioGroup
        defaultValue={defaultValue?.toString()}
        value={value}
        onValueChange={onChange}
        name={name}
      >
        <div className={inline ? "flex items-center gap-4" : "space-y-2"}>
          {options.map((opt, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 cursor-pointer"
            >
              <RadioGroupItem
                value={opt.value.toString()}
                className="data-[state=checked]:border-gp-green data-[state=checked]:bg-gp-green transition-all duration-300"
              />
              <span className="text-sm text-gp-black font-medium">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </RadioGroup>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};