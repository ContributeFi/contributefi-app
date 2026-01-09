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
import { CreateTechnicalQuestSchema } from "@/schemas";
import CustomInput from "../CustomInput";
import CustomSelect from "../CustomSelect";
import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Fragment, useState } from "react";
import CustomDateSelect from "../CustomDateSelect";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { getItemFromLocalStorage, setItemInLocalStorage } from "@/lib/utils";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import CustomTextArea from "../CustomTextArea";
import { FaLink } from "react-icons/fa";
import TaskItem from "./TaskItem";

const QUEST_GOAL = ["Project-based", "Recruit Candidates"];
const REWARD_MODES = ["Overall Reward", "Individual Task Reward"];
const REWARD_TYPES = [
  { label: "Token", value: "token" },
  { label: "Points", value: "points" },
];
const QUEST_TYPES = [
  { label: "Design", value: "design" },
  { label: "Development", value: "development" },
];
const TASK_TYPES = [
  { label: "Follow on Twitter", value: "follow_on_twitter" },
  { label: "Comment on Tweet", value: "comment_on_twitter" },
];

function TechnicalQuest({ setSheetIsOpen, setOpenQuestSuccess }) {
  const isDesktop = useIsDesktop();

  const side = isDesktop ? "right" : "bottom";

  const [open, setOpen] = useState(false);
  const [technicalQuestStep, setTechnicalQuestStep] = useState(
    getItemFromLocalStorage("technicalQuestStep") || 1,
  );
  const [collapsedTasks, setCollapsedTasks] = useState({});
  const [step1Data, setStep1Data] = useState(
    getItemFromLocalStorage("technicalQuestStep1Data") || null,
  );

  console.log({ step1Data });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: zodResolver(CreateTechnicalQuestSchema),
    defaultValues: {
      questTitle: "",
      questType: "",
      rewardType: "",
      tokenContract: null,
      rewardMode: null,
      questGoal: null,
      tasks: [
        {
          description: "",
          instruction: "",
          links: [
            {
              name: "",
              url: "",
            },
          ],
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
    setItemInLocalStorage("technicalQuestStep1Data", data);
    setTechnicalQuestStep(2);
    setStep1Data(data);
    setItemInLocalStorage("technicalQuestStep", 2);
  };

  const rewardType = watch("rewardType");

  console.log({ errors });
  const removeTaskSafe = (index) => {
    remove(index);
    setCollapsedTasks((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-md bg-[#F7F9FD] p-5 hover:bg-[#F7F9FF]/70">
          <div className="space-y-2">
            <p className="text-left text-[18px] font-semibold text-[#09032A]">
              Technical Quest
            </p>

            <p className="text-[#525866]">
              {" "}
              Building or creative tasks that are GitHub-based or design-based.
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
          {technicalQuestStep === 2 || technicalQuestStep === 3 ? (
            <>
              <FaArrowLeftLong
                className="text-3xl text-[#050215]"
                onClick={() => setTechnicalQuestStep((prev) => prev - 1)}
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
                Technical Quest
              </SheetTitle>
              <SheetDescription className="font-[300] text-[#525866]">
                Code and design-based tasks
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {technicalQuestStep === 1 ? (
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
                label="Quest Type"
                placeholder="Select"
                options={QUEST_TYPES}
                error={errors.questType?.message}
                register={register("questType")}
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

              <Controller
                name="questGoal"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2">
                    <p className="text-[14px] font-light text-[#09032A]">
                      Quest Goal
                    </p>
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      className="flex w-[80%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                    >
                      {QUEST_GOAL.map((plan) => (
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

                    {errors.questGoal && (
                      <span className="text-xs text-red-500">
                        {errors.questGoal.message}
                      </span>
                    )}
                  </div>
                )}
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

              <hr className="border border-[#F0F4FD]" />

              {fields.map((task, index) => {
                return (
                  <TaskItem
                    key={task.id}
                    taskIndex={index}
                    control={control}
                    register={register}
                    errors={errors}
                    removeTask={removeTaskSafe}
                    collapsed={collapsedTasks[index]}
                    toggleTask={toggleTask}
                    totalTasks={fields.length}
                  />
                  // <div key={task.id} className="grid gap-4">
                  //   <div className="flex items-center justify-between bg-[#EDF2FF] px-3 py-2">
                  //     <p className="font-semibold text-[#2F0FD1]">
                  //       Task {fields.length > 1 && index + 1}{" "}
                  //     </p>

                  //     <div className="flex items-center gap-2">
                  //       {/* Delete */}
                  //       {fields.length > 1 && (
                  //         <button
                  //           type="button"
                  //           className="rounded bg-white p-2"
                  //           onClick={() => remove(index)}
                  //         >
                  //           <RiDeleteBin6Fill className="text-red-500" />
                  //         </button>
                  //       )}

                  //       {/* Collapse toggle */}
                  //       <button
                  //         type="button"
                  //         onClick={() => toggleTask(index)}
                  //         className="rounded bg-white p-2"
                  //       >
                  //         {collapsedTasks[index] ? (
                  //           <IoChevronDown />
                  //         ) : (
                  //           <IoChevronUp />
                  //         )}
                  //       </button>
                  //     </div>
                  //   </div>

                  //   {!collapsedTasks[index] && (
                  //     <>
                  //       <CustomTextArea
                  //         label="Task Description"
                  //         placeholder="Briefly describe the task"
                  //         error={errors.tasks?.[index]?.description?.message}
                  //         {...register(`tasks.${index}.description`)}
                  //       />

                  //       <div className="flex items-center justify-between gap-2 text-[14px] font-light text-[#09032A]">
                  //         <p>Reference Links</p>
                  //         <p>1/5</p>
                  //       </div>

                  //       <div className="space-y-1">
                  //         <div className="flex items-center justify-between">
                  //           <p className="text-[14px] font-light text-[#09032A]">
                  //             Link 1
                  //           </p>

                  //           <button
                  //             type="button"
                  //             className="rounded-full bg-[#FCE9E9] p-2"
                  //             onClick={() => remove(index)}
                  //           >
                  //             <RiDeleteBin6Fill className="m text-red-500" />
                  //           </button>
                  //         </div>

                  //         <CustomInput
                  //           error={errors.tasks?.[index]?.link?.message}
                  //           {...register(`tasks.${index}.link`)}
                  //           placeholder="Link Name"
                  //           type="text"
                  //         />

                  //         <CustomInput
                  //           error={errors.tasks?.[index]?.link?.message}
                  //           {...register(`tasks.${index}.link`)}
                  //           placeholder="Paste URL"
                  //           prefix="https://"
                  //           type="text"
                  //         />

                  //         <button
                  //           type="button"
                  //           onClick={() => append({ type: "", points: 0 })}
                  //           className="ml-auto flex cursor-pointer items-center gap-1 text-[14px] font-light text-[#2F0FD1]"
                  //         >
                  //           <FaLink /> Add Another Link
                  //         </button>
                  //       </div>

                  //       <CustomTextArea
                  //         label="Task Instruction"
                  //         placeholder="Kindly Specify the Instructions"
                  //         error={errors.tasks?.[index]?.instruction?.message}
                  //         {...register(`tasks.${index}.instruction`)}
                  //       />
                  //     </>
                  //   )}
                  // </div>
                );
              })}

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
                  // onClick={() => append({ type: "", points: 0 })}
                  onClick={() => {
                    append({
                      description: "",
                      instruction: "",
                      links: [{ name: "", url: "" }],
                    });

                    setCollapsedTasks((prev) => ({
                      ...prev,
                      [fields.length]: false, // new task open by default
                    }));
                  }}
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
                <p className="w-1/2 font-[300] text-[#525866]">Quest Goal</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.questGoal}
                </p>
              </div>

              {/* <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">
                  Quest Duration
                </p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {formatDateToYYYYMMDD(new Date(step1Data.startDate))} to{" "}
                  {formatDateToYYYYMMDD(new Date(step1Data.endDate))}
                </p>
              </div> */}

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

              {/* <div className="flex items-center gap-2">
                <p className="w-1/2 font-[300] text-[#525866]">Quest Goal</p>
                <p className="w-1/2 font-medium text-[#050215]">
                  {step1Data.questGoal}
                </p>
              </div> */}

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
              {technicalQuestStep === 2 && (
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

              {technicalQuestStep === 3 && (
                <div className="space-y-1 text-center">
                  <p className="font-[300] text-[#09032A]">Amount Deposited</p>
                  <p className="text-2xl font-bold text-[#050215]">6,000 XLM</p>
                </div>
              )}

              {technicalQuestStep === 2 && (
                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="mt-5 w-full"
                  onClick={() => {
                    setTechnicalQuestStep((prev) => prev + 1);
                    setItemInLocalStorage("technicalQuestStep", 3);
                  }}
                >
                  Deposit Token
                </Button>
              )}

              {technicalQuestStep === 3 && (
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

export default TechnicalQuest;
