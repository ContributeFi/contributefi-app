import { Label } from "./ui/label";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

export default function CustomDateSelect({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  runContinuously,
  startDateError,
  endDateError,
}) {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  return (
    <Label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
      <div className="relative flex w-full flex-col gap-5 rounded-sm sm:flex-row">
        <>
          <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className={`w-full justify-between bg-[#F7F9FD] font-normal text-[#8791A7] shadow-none hover:bg-[#F7F9FD] hover:text-[#8791A7] ${runContinuously ? "sm:w-full" : "sm:w-[48%]"}`}
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
                  onStartDateChange(date);
                  setOpenStartDate(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </>

        {!runContinuously && (
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
                    onEndDateChange(date);
                    setOpenEndDate(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      {startDateError && (
        <span className="text-xs text-red-500">{startDateError}</span>
      )}
      {endDateError && (
        <span className="text-xs text-red-500">{endDateError}</span>
      )}
    </Label>
  );
}
