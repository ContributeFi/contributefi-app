import React from "react";
import { Field, Label, Select } from "@headlessui/react";

export default function CustomSelect({
  label,
  placeholder = "Select",
  options,
  error,
  register,
  className = "",
  disabled,
  ...rest
}) {
  return (
    <Field className="">
      <Label className="flex flex-col items-start gap-1 text-[14px] font-light text-[#09032A]">
        {label}
        <div className="relative h-[48px] w-full rounded-[12px]">
          <Select
            {...(register ? register : {})}
            className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-3 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className} w-full`}
            {...rest}
            disabled={disabled}
          >
            <option value="" className="text-[#8791A7]">
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {error && <span className="text-xs text-red-500">{error}</span>}
      </Label>
    </Field>
  );
}
