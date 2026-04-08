"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerAdvancedProps {
  value?: Date | DateRange;
  onChange: (v: Date | DateRange | undefined) => void;
  placeholder?: string;
  mode?: "single" | "range";
  className?: string;
}

export default function DatePickerAdvanced({
  value,
  onChange,
  placeholder = "Select date",
  mode = "single",
  className,
}: DatePickerAdvancedProps) {
  const [open, setOpen] = React.useState(false);

  // Normalize presets to correct shadcn range format
  const presets: { label: string; value: DateRange | null }[] = [
    { label: "Today", value: { from: new Date(), to: new Date() } },
    {
      label: "Yesterday",
      value: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) },
    },
    { label: "Last 7 Days", value: { from: addDays(new Date(), -7), to: new Date() } },
    { label: "Last 30 Days", value: { from: addDays(new Date(), -30), to: new Date() } },
    {
      label: "This Month",
      value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
    { label: "Clear", value: null },
  ];

  // Format label text
  const formatDisplay = () => {
    if (!value) return "";

    if (mode === "single" && value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (mode === "range" && (value as DateRange)?.from && (value as DateRange)?.to) {
      return `${(value as DateRange).from?.toLocaleDateString()} → ${(value as DateRange).to?.toLocaleDateString()}`;
    }

    return "";
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplay() || placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-auto" align="start">
          {/* Presets */}
          {mode === "range" && (
            <div className="flex border-b border-[var(--gp-border)] p-2 gap-2">
              {presets.map((p) => (
                <Button
                  key={p.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange(p.value || undefined);
                    setOpen(false);
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          )}

          {/* Calendar */}
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={value as Date | undefined}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              className="rounded-md"
            />
          ) : (
            <Calendar
              mode="range"
              selected={value as DateRange | undefined}
              onSelect={(range) => {
                onChange(range);
              }}
              className="rounded-md"
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}