import { Label } from "./ui/label";
import { Checkbox } from "@headlessui/react";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export default function CustomDateSelect({ label, error }) {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      {label}

      <div className="relative flex w-full flex-col gap-5 rounded-sm sm:flex-row">
        {/* {startDate && ( */}
        <>
          <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between bg-[#F7F9FD] font-normal text-[#8791A7] shadow-none hover:bg-[#F7F9FD] hover:text-[#8791A7] sm:w-[48%]"
              >
                {startDate ? startDate.toLocaleDateString() : "Start Date"}
                <IoMdArrowDropdown />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={startDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setStartDate(date);
                  setOpenStartDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </>
        {/* )} */}
        {/* {endDate && ( */}
        <>
          <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between bg-[#F7F9FD] font-normal text-[#8791A7] shadow-none hover:bg-[#F7F9FD] hover:text-[#8791A7] sm:w-[48%]"
              >
                {endDate ? endDate.toLocaleDateString() : "End Date"}
                <IoMdArrowDropdown />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setEndDate(date);
                  setOpenEndDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </>
        {/* )} */}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </Label>
  );
}
