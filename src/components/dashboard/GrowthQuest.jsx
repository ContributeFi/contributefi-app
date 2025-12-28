import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { IoIosArrowForward, IoMdArrowDropdown } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateGrowthQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";
import CustomDateSelect from "../CustomDateSelect";

const rewardMode = ["Overall Reward", "Individual Task Reward"];

function GrowthQuest({ sheetIsOpen, setSheetIsOpen }) {
  const isDesktop = useIsDesktop();

  const side = isDesktop ? "right" : "bottom";

  let [selected, setSelected] = useState(rewardMode[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    resolver: zodResolver(CreateGrowthQuestSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-[#F7F9FD] p-5 hover:bg-[#F7F9FF]/70">
          <div className="space-y-2">
            <p className="text-left text-[18px] font-semibold text-[#09032A]">
              Growth Quest
            </p>

            <p className="text-[#525866]">
              {" "}
              Social media engagement and community growth tasks.
            </p>
          </div>

          <IoIosArrowForward className="text-[#2F0FD1]" />
        </div>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`bg-white ${side === "bottom" ? "h-[80%]" : "sm:max-w-xl"} overflow-scroll`}
      >
        <SheetHeader className="bg-white px-4 shadow">
          <SheetTitle className="text-[28px] font-bold text-[#09032A]">
            Growth Quest
          </SheetTitle>
          <SheetDescription className="font-[300] text-[#525866]">
            Boost visibility and engagement across social media
          </SheetDescription>
        </SheetHeader>

        <form
          className="grid gap-5 px-4 py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            label="Quest Title"
            placeholder="Enter Title"
            type="text"
            error={errors.questTitle?.message}
            {...register("questTitle")}
          />

          <CustomSelect
            label="Reward Type"
            placeholder="Select"
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]}
            error={errors.rewardType?.message}
            register={register("rewardType")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <CustomInput
              label="Number of Winners"
              placeholder="0"
              type="number"
              error={errors.numberOfWinners?.message}
              {...register("numberOfWinners")}
            />

            <CustomSelect
              label="Winner Selection Method"
              placeholder="Select"
              options={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ]}
              error={errors.winnerSelectionMethod?.message}
              register={register("winnerSelectionMethod")}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex w-full items-center justify-between text-[14px] font-light text-[#09032A]">
              Quest Duration
              <div className="ml-auto flex items-center gap-2">
                <p className="text-[15px] font-[300] text-[#09032A]">
                  Run quest continuously
                </p>
                <Checkbox className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200">
                  <svg
                    className="stroke-white opacity-0 group-data-checked:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
              </div>
            </div>

            <CustomDateSelect
              placeholder="Start Date"
              error={errors.questDuration?.message}
              {...register("questDuration")}
              icon={<IoMdArrowDropdown />}
              startDate={true}
              endDate={true}
            />
          </div>

          <div className="grid gap-2">
            <p className="text-[14px] font-light text-[#09032A]">Reward Mode</p>
            <RadioGroup
              value={selected}
              onChange={setSelected}
              className="flex w-[80%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
            >
              {rewardMode.map((plan) => (
                <Field key={plan} className="flex items-center gap-2">
                  <Radio
                    value={plan}
                    className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-[#2F0FD1]"
                  >
                    <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                  </Radio>
                  <Label className="text-[15px] font-[300] text-[#09032A]">
                    {plan}
                  </Label>
                </Field>
              ))}
            </RadioGroup>
          </div>

          <hr className="border border-[#F0F4FD]" />

          <div className="bg-[#EDF2FF] px-3 py-2">
            <p className="font-semibold text-[#2F0FD1]">Task</p>
          </div>

          <CustomSelect
            label="Select Task Type"
            placeholder="Select"
            options={[
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]}
            error={errors.winnerSelectionMethod?.message}
            register={register("winnerSelectionMethod")}
          />

          <button className="ml-auto text-[#2F0FD1] flex items-center gap-1">+ Add Another Task</button>

          <Button
            // disabled={createCommunityPending}
            variant="secondary"
            size="lg"
            type="submit"
            className="mt-5 w-full"
          >
            Continue
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default GrowthQuest;
