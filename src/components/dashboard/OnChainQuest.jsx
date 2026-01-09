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
import { IoIosArrowForward } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreateOnChainQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Fragment, useState } from "react";
import CustomDateSelect from "../CustomDateSelect";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { getItemFromLocalStorage, setItemInLocalStorage } from "@/lib/utils";
import { FaArrowLeftLong } from "react-icons/fa6";
import { formatDateToYYYYMMDD } from "@/utils";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const VERIFICATION_MODES = ["Contract Invocation", "Observe Account Calls"];
const REWARD_MODES = ["Overall Reward", "Individual Task Reward"];
const REWARD_TYPES = [
  { label: "Token", value: "token" },
  { label: "Points", value: "points" },
];
const TASK_TYPES = [
  { label: "Follow on Twitter", value: "follow_on_twitter" },
  { label: "Comment on Tweet", value: "comment_on_twitter" },
];

const TASK_PREVIEW_CONFIG = {
  follow_on_twitter: {
    label: "Twitter Profile",
    field: "twitterUrl",
  },
  comment_on_twitter: {
    label: "Tweet URL",
    field: "tweetUrl",
  },
};

function OnChainQuest({ setSheetIsOpen, setOpenQuestSuccess }) {
  const isDesktop = useIsDesktop();

  const side = isDesktop ? "right" : "bottom";

  const [open, setOpen] = useState(false);
  const [onChainQuestStep, setOnChainQuestStep] = useState(
    getItemFromLocalStorage("onChainQuestStep") || 1,
  );
  const [collapsedTasks, setCollapsedTasks] = useState({});
  const [step1Data, setStep1Data] = useState(
    getItemFromLocalStorage("onChainQuestStep1Data") || null,
  );

  console.log({ step1Data });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(CreateOnChainQuestSchema),
    defaultValues: {
      questTitle: "",
      rewardType: "",
      tokenContract: null,
      numberOfWinners: null,
      winnerSelectionMethod: "",
      runContinuously: false,
      startDate: null,
      endDate: null,
      rewardMode: null,
      contractAddress: "",
      verificationMode: null,
      pointsPerWinner: null,
      tasks: [
        {
          type: "",
          description: "",
          link: undefined,
        },
      ],
    },
  });

  const toggleTask = (index) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks", // matches defaultValues
  });

  const onSubmit = (data) => {
    console.log(data);
    setItemInLocalStorage("onChainQuestStep1Data", data);
    setOnChainQuestStep(2);
    setStep1Data(data);
    setItemInLocalStorage("onChainQuestStep", 2);
  };

  const rewardType = watch("rewardType");

  console.log({ errors });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-[#F7F9FD] p-5 hover:bg-[#F7F9FF]/70">
          <div className="space-y-2">
            <p className="text-left text-[18px] font-semibold text-[#09032A]">
              On-chain Interaction Quest
            </p>

            <p className="text-[#525866]">
              {" "}
              Blockchain interactions with Soroban or other networks.
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
          {onChainQuestStep === 2 || onChainQuestStep === 3 ? (
            <>
              <FaArrowLeftLong
                className="text-3xl text-[#050215]"
                onClick={() => setOnChainQuestStep((prev) => prev - 1)}
              />
              <SheetTitle className="text-[28px] font-bold text-[#09032A]">
                Quest Preview
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Summary of the quest created
              </SheetDescription>
            </>
          ) : (
            <>
              <SheetTitle className="text-[28px] font-bold text-[#09032A]">
                On-Chain Quest
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Engagement with projects’ smart contracts
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {onChainQuestStep === 1 ? (
          <>
            {" "}
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
                options={REWARD_TYPES}
                error={errors.rewardType?.message}
                register={register("rewardType")}
              />

              {rewardType === "token" && (
                <CustomInput
                  label="Token Contract"
                  placeholder="000000000000000000000"
                  type="text"
                  error={errors.tokenContract?.message}
                  {...register("tokenContract")}
                  className={rewardType !== "token" ? "hidden" : ""}
                />
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <CustomInput
                  label="Number of Winners"
                  placeholder="eg 50"
                  type="number"
                  error={errors.numberOfWinners?.message}
                  {...register("numberOfWinners", { valueAsNumber: true })}
                />

                <CustomSelect
                  label="Winner Selection Method"
                  placeholder="Select"
                  options={[
                    { label: "Random", value: "random" },
                    { label: "FCFS", value: "fcfs" },
                  ]}
                  error={errors.winnerSelectionMethod?.message}
                  register={register("winnerSelectionMethod")}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex w-full items-center justify-between text-[14px] font-light text-[#09032A]">
                  Quest Duration
                  <div className="ml-auto flex items-center gap-2">
                    <p className="text-[14px] font-[300] text-[#09032A]">
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
                      startDateError={errors.startDate?.message}
                      endDateError={errors.endDate?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="verificationMode"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="text-[14px] font-light text-[#09032A]">
                      Verification Mode
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[80%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {VERIFICATION_MODES.map((plan) => (
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

                    {errors.verificationMode && (
                      <span className="text-xs text-red-500">
                        {errors.verificationMode.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <CustomInput
                label="Contract Address"
                placeholder="Enter Contract Address"
                type="text"
                error={errors.contractAddress?.message}
                {...register("contractAddress")}
              />

              <Controller
                name="rewardMode"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="text-[14px] font-light text-[#09032A]">
                      Reward Mode
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[80%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {REWARD_MODES.map((plan) => (
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

                    {errors.rewardMode && (
                      <span className="text-xs text-red-500">
                        {errors.rewardMode.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <CustomInput
                label={`${rewardType === "token" ? "How many tokens per winner?" : "How many points per winner?"}`}
                placeholder="eg 50"
                type="number"
                error={errors.pointsPerWinner?.message}
                {...register("pointsPerWinner", { valueAsNumber: true })}
              />

              <hr className="border border-[#F0F4FD]" />

              {fields.map((task, index) => (
                <div key={task.id} className="grid gap-4">
                  <div className="flex items-center justify-between bg-[#EDF2FF] px-3 py-2">
                    <p className="font-semibold text-[#2F0FD1]">Task </p>

                    <div className="flex items-center gap-2">
                      {/* Delete */}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="rounded bg-white p-2"
                          onClick={() => remove(index)}
                        >
                          <RiDeleteBin6Fill className="text-red-500" />
                        </button>
                      )}

                      {/* Collapse toggle */}
                      <button
                        type="button"
                        onClick={() => toggleTask(index)}
                        className="rounded bg-white p-2"
                      >
                        {collapsedTasks[index] ? (
                          <IoChevronDown />
                        ) : (
                          <IoChevronUp />
                        )}
                      </button>
                    </div>
                  </div>

                  {!collapsedTasks[index] && (
                    <>
                      <CustomInput
                        label="Description"
                        placeholder="Enter Task Description"
                        type="text"
                        error={errors.tasks?.[index]?.description?.message}
                        {...register(`tasks.${index}.description`)}
                      />

                      <CustomSelect
                        label="Function Name"
                        placeholder="Select"
                        options={TASK_TYPES}
                        error={errors.tasks?.[index]?.type?.message}
                        register={register(`tasks.${index}.type`)}
                      />

                      <CustomInput
                        label="Link (Optional)"
                        error={errors.tasks?.[index]?.link?.message}
                        {...register(`tasks.${index}.link`)}
                        placeholder="Paste URL"
                        prefix="https://"
                        type="text"
                      />
                    </>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2">
                {fields.length > 1 && (
                  <>
                    {" "}
                    <Controller
                      name="makeConcurrent"
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
                    <p className="text-[14px] font-[300] text-[#09032A]">
                      Make the tasks concurrent
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => append({ type: "", points: 0 })}
                  className="ml-auto flex cursor-pointer items-center gap-1 text-[#2F0FD1]"
                >
                  + Add Another Task
                </button>
              </div>

              <Button
                variant="secondary"
                size="lg"
                type="submit"
                className="mt-5 w-full"
              >
                Continue
              </Button>
            </form>
          </>
        ) : (
          <div className="px-4 py-4 text-[14px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Quest Title</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.questTitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Reward Type</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.rewardType}
                </p>
              </div>

              {step1Data.rewardType === "token" && (
                <div className="flex items-center gap-2">
                  <p className="w-1/2 font-[300] text-[#525866]">
                    Token Contract
                  </p>
                  <p className="w-1/2 font-medium text-[#050215]">
                    {step1Data.tokenContract}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Number of Winners
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.numberOfWinners}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Quest Duration
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {formatDateToYYYYMMDD(new Date(step1Data.startDate))} to{" "}
                  {formatDateToYYYYMMDD(new Date(step1Data.endDate))}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Selection Method
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.winnerSelectionMethod}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Reward Mode</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.rewardMode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Verification Mode
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.verificationMode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Contract Address
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.contractAddress}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Reward Per Winner
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.pointsPerWinner} XLM
                </p>
              </div>
            </div>

            <hr className="my-6 border border-[#F0F4FD]" />

            {step1Data.tasks.map((task, index) => {
              return (
                <Fragment key={index}>
                  <div className="mb-4">
                    <div className="rounded-[8px] bg-[#EDF2FF] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#2F0FD1]">
                          Task {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleTask(index)}
                          className="rounded bg-white p-2"
                        >
                          {collapsedTasks[index] ? (
                            <IoChevronDown />
                          ) : (
                            <IoChevronUp />
                          )}
                        </button>
                      </div>

                      {!collapsedTasks[index] && (
                        <div className="mt-2 flex flex-wrap justify-between rounded-[8px] bg-white p-4">
                          <div className="space-y-2">
                            <p className="font-[300] text-[#525866]">
                              Task Description
                            </p>
                            <p className="font-medium text-[#050215]">
                              {task.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="font-[300] text-[#525866]">
                              Functional Name
                            </p>
                            <p className="font-medium text-[#050215]">
                              {task.type}
                            </p>
                          </div>

                          {task.link && (
                            <div className="space-y-2">
                              <p className="font-[300] text-[#525866]">Link</p>
                              <p className="font-medium text-[#050215]">
                                {task.link}
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <p className="font-[300] text-[#525866]">Link</p>
                            <p className="font-medium text-[#050215]">
                              {task.link}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}

            <div className="flex flex-wrap items-center gap-2">
              <>
                {" "}
                <Controller
                  name="makeConcurrent"
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
                <p className="text-[14px] font-[300] text-[#09032A]">
                  Reward all participants with points
                </p>
              </>
            </div>

            <div className="mt-6 space-y-2 rounded-[8px] bg-[#EDF2FF] px-9 py-6">
              {onChainQuestStep === 2 && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">
                      Total Rewards (to be deposited):
                    </p>
                    <p className="text-2xl font-bold text-[#050215]">
                      6,000 XLM
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="font-[300] text-[#09032A]">Fees to Charge</p>
                    <p className="text-2xl font-bold text-[#050215]">100 XLM</p>
                  </div>
                </>
              )}

              {onChainQuestStep === 3 && (
                <div className="space-y-1 text-center">
                  <p className="font-[300] text-[#09032A]">Amount Deposited</p>
                  <p className="text-2xl font-bold text-[#050215]">6,000 XLM</p>
                </div>
              )}

              {onChainQuestStep === 2 && (
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="mt-5 w-full"
                  onClick={() => {
                    setOnChainQuestStep((prev) => prev + 1);
                    setItemInLocalStorage("onChainQuestStep", 3);
                  }}
                >
                  Deposit Token
                </Button>
              )}

              {onChainQuestStep === 3 && (
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="mt-5 w-full"
                  onClick={() => {
                    setSheetIsOpen(false);
                    setOpenQuestSuccess(true);
                  }}
                >
                  Publish Quest
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default OnChainQuest;
