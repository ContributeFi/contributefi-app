import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function CustomSelect({
  label,
  placeholder = "Select",
  options,
  error,
  className = "",
  disabled,
  value,
  onValueChange,
  ...rest
}) {
  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      {label}
      <div className="relative w-full rounded-sm">
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          {...rest}
        >
          <SelectTrigger
            className={`w-full border-none bg-[#F7F9FD] ${className}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </Label>
  );
}
