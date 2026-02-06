import * as React from "react";
import { Check } from "lucide-react";
import { LuSlidersVertical } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  // {
  //   value: "DeFi",
  //   label: "DeFi",
  // },
  // {
  //   value: "Dex",
  //   label: "Dex",
  // },
];

function Filter({ tag }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className={`group ${tag === "landing" ? "bg-[#2F0FD1] hover:bg-[#F7F9FD]" : "bg-[#F7F9FD] hover:bg-[#2F0FD1]"} py-5 shadow`}
        >
          <LuSlidersVertical
            className={`text-[24px] ${tag === "landing" ? "text-[#F7F9FD] group-hover:text-[#2F0FD1]" : "text-[#2F0FD1] group-hover:text-[#F7F9FD]"}`}
          />

          <span
            className={`hidden sm:block ${tag === "landing" ? "text-[#F7F9FD] group-hover:text-[#2F0FD1]" : "text-[#2F0FD1] group-hover:text-[#F7F9FD]"}`}
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Filter"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search filter..." className="h-9" />
          <CommandList>
            <CommandEmpty>No filter found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Filter;
