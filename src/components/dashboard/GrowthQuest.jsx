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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreateGrowthQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";
import CustomDateSelect from "../CustomDateSelect";
import { RiDeleteBin6Fill } from "react-icons/ri";

const rewardMode = ["Overall Reward", "Individual Task Reward"];
const options = [
  { label: "Token", value: "token" },
  { label: "Cash", value: "cash" },
];

function GrowthQuest({ sheetIsOpen, setSheetIsOpen }) {
  const isDesktop = useIsDesktop();

  const side = isDesktop ? "right" : "bottom";

  let [selected, setSelected] = useState(rewardMode[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(CreateGrowthQuestSchema),
    defaultValues: {
      rewardType: "token",
      tokenContract: "",
      startDate: undefined,
      endDate: undefined,
      runContinuously: false,
      numberOfWinners: 0,
      tasks: [{ type: "", points: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks", // matches defaultValues
  });

  console.log({ errors });

  const onSubmit = (data) => {
    console.log(data);
  };

  const rewardType = watch("rewardType");

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

          <Controller
            name="rewardType"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Reward Type"
                placeholder="Select"
                options={options}
                error={errors.rewardType?.message}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          <div className={rewardType !== "token" ? "hidden" : ""}>
            <CustomInput
              label="Token Contract"
              placeholder="000000000000000000000"
              type="text"
              error={errors.tokenContract?.message}
              {...register("tokenContract")}
            />
          </div>

          {/* {rewardType === "token" && (
            <CustomInput
              label="Token Contract"
              placeholder="000000000000000000000"
              type="text"
              error={errors.tokenContract?.message}
              {...register("tokenContract")}
              className={rewardType !== "token" ? "hidden" : ""}
            />
          )} */}

          <div className="grid gap-5 sm:grid-cols-2">
            <CustomInput
              label="Number of Winners"
              placeholder="0"
              type="number"
              error={errors.numberOfWinners?.message}
              {...register("numberOfWinners", { valueAsNumber: true })}
            />

            {/* <CustomSelect
              label="Winner Selection Method"
              placeholder="Select"
              options={[
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ]}
              error={errors.winnerSelectionMethod?.message}
              register={register("winnerSelectionMethod")}
            /> */}

            <Controller
              name="winnerSelectionMethod"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Winner Selection Method"
                  options={[
                    { label: "Option 1", value: "option1" },
                    { label: "Option 2", value: "option2" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.winnerSelectionMethod?.message}
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex w-full items-center justify-between text-[14px] font-light text-[#09032A]">
              Quest Duration
              <div className="ml-auto flex items-center gap-2">
                <p className="text-[15px] font-[300] text-[#09032A]">
                  Run quest continuously
                </p>
                <Controller
                  name="runContinuously"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200"
                    >
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
                  )}
                />
              </div>
            </div>

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <CustomDateSelect
                  startDate={field.value}
                  endDate={watch("endDate")}
                  onStartDateChange={field.onChange}
                  onEndDateChange={(date) =>
                    setValue("endDate", date, { shouldValidate: true })
                  }
                  runContinuously={watch("runContinuously")}
                  //   error={errors.startDate?.message}
                  startDateError={errors.startDate?.message}
                  endDateError={errors.endDate?.message}
                />
              )}
            />

            {/* <CustomDateSelect
              error={errors.startDate?.message}
              {...register("startDate")}
              setValue={setValue}
              runContinuously={watch("runContinuously")}
            /> */}
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

          <CustomInput
            label="How many points per winner?"
            placeholder="eg 50"
            type="number"
            error={errors.numberOfWinners?.message}
            {...register("numberOfWinners", { valueAsNumber: true })}
          />

          <hr className="border border-[#F0F4FD]" />

          {fields.map((task, index) => (
            <div key={task.id} className="grid gap-4">
              <div className="flex items-center justify-between bg-[#EDF2FF] px-3 py-2">
                <p className="font-semibold text-[#2F0FD1]">Task {index + 1}</p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="text-md bg-white p-2"
                    onClick={() => remove(index)}
                  >
                    <RiDeleteBin6Fill className="text-red-500" />
                  </button>
                )}
              </div>

              <Controller
                name={`tasks.${index}.type`}
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Select Task Type"
                    placeholder="Select"
                    options={[
                      { label: "Option 1", value: "option1" },
                      { label: "Option 2", value: "option2" },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />

              {/* <CustomInput
                label="How many points per winner?"
                placeholder="eg 50"
                type="number"
                {...register(`tasks.${index}.points`, { valueAsNumber: true })}
                error={errors.tasks?.[index]?.points?.message}
              /> */}
            </div>
          ))}

          {/* <div className="bg-[#EDF2FF] px-3 py-2">
            <p className="font-semibold text-[#2F0FD1]">Task 1</p>
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
          /> */}

          <button
            type="button"
            onClick={() => append({ type: "", points: 0 })}
            className="ml-auto flex items-center gap-1 text-[#2F0FD1]"
          >
            + Add Another Task
          </button>

          <Button
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
