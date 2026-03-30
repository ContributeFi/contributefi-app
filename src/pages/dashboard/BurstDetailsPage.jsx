import BackButton from "@/components/BackButton";
import { getBurst } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { FaUsers } from "react-icons/fa";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { Fragment } from "react";
import { endTime, timeAgo } from "@/utils";
import { IoIosCheckmarkCircle, IoIosRefreshCircle } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomInput from "@/components/CustomInput";
import { useCompleteTask } from "@/hooks/useCompleteTask";
import TaskSubmissionForm from "@/components/dashboard/TaskSubmissionForm";
import OnChainTaskInput from "@/components/dashboard/OnChainTaskInput";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { BsInfoCircleFill } from "react-icons/bs";

function BurstDetailsPage() {
  const { burstId } = useParams();
  const { requireAuth } = useRequireAuth();

  console.log({ burstId });

  const { mutateAsync: completeTask } = useCompleteTask();

  const { user } = useAuth();

  const handleCompleteTask = async (e, task) => {
    e.stopPropagation();

    if (!requireAuth()) return;

    const taskId = task.id;

    // await createGrowthQuest(payload, communityId);
    await completeTask({ taskId });
  };

  const {
    data: burst,
    isLoading: loadingQuest,
    isError: errorLoadingQuest,
  } = useQuery({
    queryKey: ["burst", burstId],
    queryFn: () => getBurst(burstId),
    enabled: !!burstId,
  });

  console.log({ burst });

  return (
    <div>
      <div className="space-y-8">
        <div className="md:hidden">
          <BackButton />
        </div>

        <div className="space-y-[32px] rounded-[4px] bg-white px-4 py-6 lg:px-[56px] lg:pt-[32px] lg:pb-[80px]">
          <div className="hidden md:block">
            <BackButton />
          </div>

          {loadingQuest ? (
            <Loader />
          ) : errorLoadingQuest ? (
            <Error title="Failed to load community details." />
          ) : (
            <div className="space-y-6">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="space-y-4">
                      <h2 className="font-bricolage text-[20px] font-bold text-[#050215]">
                        {burst?.burstTitle}
                      </h2>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex shrink-0 items-center justify-between gap-2 rounded-[144px] bg-[#F0F4FD] px-5 py-2">
                          <BsInfoCircleFill />
                          <p
                            className={`flex gap-1.5 font-normal text-[#525866]`}
                          >
                            Your entry should be:{" "}
                            <span
                              className={`font-semibold ${burst?.sentimentCheck === "Positive" ? "text-[#67AD19]" : burst?.sentimentCheck === "Negative" ? "text-[#FF3B30]" : "text-[#525866]"}`}
                            >
                              {burst?.sentimentCheck}
                            </span>
                          </p>
                        </div>

                        <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
                          <img src="/Gift.svg" alt="" />
                          {burst.tokensForWinner} {burst.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`grid grid-cols-2 divide-x-[3px] divide-y-[3px] divide-[#F0F4FD] overflow-hidden rounded-[8px] border-[3px] border-[#F0F4FD] lg:grid-cols-4 lg:divide-y-0 lg:py-5 [@media(max-width:379px)]:grid-cols-1 [@media(max-width:379px)]:divide-x-0 [@media(max-width:379px)]:divide-y-[3px]`}
                  >
                    {burst?.participants && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Number of Participants</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.participants.length}
                        </p>
                      </div>
                    )}

                    {burst?.endDate && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Burst Time</p>
                        <p className="font-semibold text-[#09032A]">
                          {endTime(burst?.endDate)}
                        </p>
                      </div>
                    )}

                    {burst?.trendAge && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]">Trend Age</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.trendAge}
                        </p>
                      </div>
                    )}

                    {burst?.numberOfSelections && (
                      <div className="space-y-[12px] px-4 py-5 text-center lg:py-0">
                        <p className="text-[#525866]"> Number of Winners</p>
                        <p className="font-semibold text-[#09032A]">
                          {burst?.numberOfSelections}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="font-normal text-[#525866]">
                    {burst?.conversation}
                  </p>
                </div>

                {/* {quest.category === "ON_CHAIN" && (
                  <div className="space-y-[20px]">
                    {quest.tasks.map((task, i) => {
                      return (
                        <Fragment key={i}>
                          <>
                            <Accordion
                              type="single"
                              collapsible
                              className="rounded-[8px] border border-[#8791A7] p-1"
                            >
                              <AccordionItem
                                // className="mb-5 rounded-2xl bg-[#F7F9FD] p-6 py-4 shadow-none"
                                className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                                value={task?.payload?.functionSpec?.doc}
                              >
                                <AccordionTrigger
                                  className={`cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline`}
                                >
                                  <p className="flex w-full items-center justify-between gap-2">
                                    <span>
                                      {task?.payload?.functionSpec?.doc}
                                    </span>

                                    <span className="text-white">
                                      {quest?.rewardType === "Token" &&
                                        task.tokensPerTask &&
                                        `(${task.tokensPerTask + " " + quest?.symbol})`}

                                      {quest?.rewardType === "Points" &&
                                        task?.pointsPerTask &&
                                        `(${task?.pointsPerTask + " Points"})`}
                                    </span>
                                  </p>
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                                  <div className="space-y-3">
                                    {task?.userProgress?.completed ? (
                                      <>
                                        <CustomInput
                                          placeholder="Paste Post URL Here"
                                          value={task?.userProgress?.submission}
                                          disabled
                                          icon={
                                            <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                                          }
                                        />
                                      </>
                                    ) : (
                                      <OnChainTaskInput
                                        task={task}
                                        quest={quest}
                                        userId={user?.id}
                                      />
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </>
                        </Fragment>
                      );
                    })}
                  </div>
                )}

                {quest.category === "GROWTH" && (
                  <div className="space-y-[20px]">
                    {quest?.tasks.map((task, i) => {
                      return (
                        <Fragment key={i}>
                          {task.title === "Follow on Twitter" && (
                            <button
                              className={`flex w-full cursor-pointer items-center justify-between rounded-[8px] border ${task?.userProgress?.completed ? "bg-[#EDF2FF]" : "bg-[#2F0FD1]"} px-8 py-4`}
                            >
                              <p
                                className={`${task?.userProgress?.completed ? "text-[#1C097D]" : "text-white"} flex w-[92%] items-center justify-between gap-2`}
                              >
                                <span> {task?.title}</span>
                                <span className="text-white">
                                  {quest?.rewardType === "Token" &&
                                    task.tokensPerTask &&
                                    `(${task.tokensPerTask + " " + quest?.symbol})`}

                                  {quest?.rewardType === "Points" &&
                                    task?.pointsPerTask &&
                                    `(${task?.pointsPerTask + " Points"})`}
                                </span>
                              </p>

                              {task?.userProgress?.completed ? (
                                <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                              ) : (
                                <IoIosRefreshCircle
                                  onClick={(e) => handleCompleteTask(e, task)}
                                  className="text-[30px] text-white"
                                />
                              )}
                            </button>
                          )}

                          {task.title === "Like Tweet" && (
                            <button
                              className={`flex w-full cursor-pointer items-center justify-between rounded-[8px] border ${task?.userProgress?.completed ? "bg-[#EDF2FF]" : "bg-[#2F0FD1]"} px-8 py-4`}
                            >
                              <p
                                className={`${task?.userProgress?.completed ? "text-[#1C097D]" : "text-white"} flex w-[92%] items-center justify-between gap-2`}
                              >
                                <span>{task?.title} </span>
                                <span className="text-white">
                                  {quest?.rewardType === "Token" &&
                                    task.tokensPerTask &&
                                    `(${task.tokensPerTask + " " + quest?.symbol})`}

                                  {quest?.rewardType === "Points" &&
                                    task?.pointsPerTask &&
                                    `(${task?.pointsPerTask + " Points"})`}
                                </span>
                              </p>

                              {task?.userProgress?.completed ? (
                                <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                              ) : (
                                <IoIosRefreshCircle
                                  onClick={(e) => handleCompleteTask(e, task)}
                                  className="text-[30px] text-white"
                                />
                              )}
                            </button>
                          )}

                          {task.title === "Post on Twitter" && (
                            <>
                              <Accordion
                                type="single"
                                collapsible
                                className="rounded-[8px] border border-[#8791A7] p-1"
                              >
                                <AccordionItem
                                  // className="mb-5 rounded-2xl bg-[#F7F9FD] p-6 py-4 shadow-none"
                                  className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                                  value={task?.title}
                                >
                                  <AccordionTrigger
                                    className={`cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline`}
                                  >
                                    <p className="flex w-full items-center justify-between gap-2">
                                      <span>{task.title} </span>

                                      <span className="text-white">
                                        {quest?.rewardType === "Token" &&
                                          task.tokensPerTask &&
                                          `(${task.tokensPerTask + " " + quest?.symbol})`}

                                        {quest?.rewardType === "Points" &&
                                          task?.pointsPerTask &&
                                          `(${task?.pointsPerTask + " Points"})`}
                                      </span>
                                    </p>
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                                    <div className="space-y-3">
                                      {task?.userProgress?.completed ? (
                                        <>
                                          <CustomInput
                                            placeholder="Paste Post URL Here"
                                            value={
                                              task?.userProgress?.submission
                                            }
                                            disabled
                                            icon={
                                              <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <div>1.</div>
                                            <a
                                              href="https://x.com"
                                              target="_blank"
                                              className="flex h-[48px] w-full items-center rounded-[8px] border px-4 py-4 text-sm text-[#2F0FD1]"
                                            >
                                              Make a Post
                                            </a>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div>2.</div>
                                            <TaskSubmissionForm task={task} />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </>
                          )}

                          {task.title === "Comment on Twitter" && (
                            <>
                              <Accordion
                                type="single"
                                collapsible
                                className="rounded-[8px] border border-[#8791A7] p-1"
                              >
                                <AccordionItem
                                  // className="mb-5 rounded-2xl bg-[#F7F9FD] p-6 py-4 shadow-none"
                                  className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                                  value={task?.title}
                                >
                                  <AccordionTrigger className="cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline">
                                    <p className="flex w-full items-center justify-between gap-2">
                                      <span>{task.title} </span>

                                      <span className="text-white">
                                        {quest?.rewardType === "Token" &&
                                          task.tokensPerTask &&
                                          `(${task.tokensPerTask + " " + quest?.symbol})`}

                                        {quest?.rewardType === "Points" &&
                                          task?.pointsPerTask &&
                                          `(${task?.pointsPerTask + " Points"})`}
                                      </span>
                                    </p>
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                                    <div className="space-y-3">
                                      {task?.userProgress?.completed ? (
                                        <>
                                          <CustomInput
                                            placeholder="Paste Post URL Here"
                                            value={
                                              task?.userProgress?.submission
                                            }
                                            disabled
                                            icon={
                                              <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <div>1.</div>
                                            <a
                                              href={task?.payload?.tweetUrl}
                                              target="_blank"
                                              className="flex h-[48px] w-full items-center rounded-[8px] border px-4 py-4 text-sm text-[#2F0FD1]"
                                            >
                                              Make a Comment
                                            </a>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <div>2.</div>
                                            <TaskSubmissionForm task={task} />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </>
                          )}

                          {task.title === "Post on Discord" && (
                            <>
                              <Accordion
                                type="single"
                                collapsible
                                className="rounded-[8px] border border-[#8791A7] p-1"
                              >
                                <AccordionItem
                                  // className="mb-5 rounded-2xl bg-[#F7F9FD] p-6 py-4 shadow-none"
                                  className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                                  value={task?.title}
                                >
                                  <AccordionTrigger className="cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline">
                                    <p className="flex w-[92%] items-center justify-between gap-2">
                                      <span>{task.title} </span>

                                      <span className="text-white">
                                        {quest?.rewardType === "Token" &&
                                          task.tokensPerTask &&
                                          `(${task.tokensPerTask + " " + quest?.symbol})`}

                                        {quest?.rewardType === "Points" &&
                                          task?.pointsPerTask &&
                                          `(${task?.pointsPerTask + " Points"})`}
                                      </span>
                                    </p>
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                                    <div className="space-y-3">
                                      {task?.userProgress?.completed ? (
                                        <>
                                          <CustomInput
                                            placeholder="Paste Post URL Here"
                                            value={
                                              task?.userProgress?.submission
                                            }
                                            disabled
                                            icon={
                                              <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <div>1.</div>
                                            <a
                                              href={`${task?.payload?.discordLink}/${task?.payload?.channelId}`}
                                              target="_blank"
                                              className="flex h-[48px] w-full items-center rounded-[8px] border px-4 py-4 text-sm text-[#2F0FD1]"
                                            >
                                              Make a Post
                                            </a>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <div>2.</div>
                                            <TaskSubmissionForm task={task} />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </>
                          )}

                          {task.title === "Join Telegram Channel" && (
                            <button
                              className={`flex w-full cursor-pointer items-center justify-between rounded-[8px] border ${task?.userProgress?.completed ? "bg-[#EDF2FF]" : "bg-[#2F0FD1]"} px-8 py-4`}
                            >
                              <p
                                className={`${task?.userProgress?.completed ? "text-[#1C097D]" : "text-white"} flex w-[92%] items-center justify-between gap-2`}
                              >
                                <span>{task?.title} </span>
                                <span className="text-white">
                                  {quest?.rewardType === "Token" &&
                                    task.tokensPerTask &&
                                    `(${task.tokensPerTask + " " + quest?.symbol})`}

                                  {quest?.rewardType === "Points" &&
                                    task?.pointsPerTask &&
                                    `(${task?.pointsPerTask + " Points"})`}
                                </span>
                              </p>

                              {task?.userProgress?.completed ? (
                                <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                              ) : (
                                <IoIosRefreshCircle
                                  onClick={(e) => handleCompleteTask(e, task)}
                                  className="text-[30px] text-white"
                                />
                              )}
                            </button>
                          )}

                          {task.title === "Post on Telegram Group" && (
                            <>
                              <Accordion
                                type="single"
                                collapsible
                                className="rounded-[8px] border border-[#8791A7] p-1"
                              >
                                <AccordionItem
                                  // className="mb-5 rounded-2xl bg-[#F7F9FD] p-6 py-4 shadow-none"
                                  className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                                  value={task?.title}
                                >
                                  <AccordionTrigger className="cursor-pointer bg-[#2F0FD1] px-8 py-4 text-white hover:no-underline">
                                    <p className="flex w-full items-center justify-between gap-2">
                                      <span>{task.title} </span>

                                      <span className="text-white">
                                        {quest?.rewardType === "Token" &&
                                          task.tokensPerTask &&
                                          `(${task.tokensPerTask + " " + quest?.symbol})`}

                                        {quest?.rewardType === "Points" &&
                                          task?.pointsPerTask &&
                                          `(${task?.pointsPerTask + " Points"})`}
                                      </span>
                                    </p>
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                                    <div className="space-y-3">
                                      {task?.userProgress?.completed ? (
                                        <>
                                          <CustomInput
                                            placeholder="Paste Post URL Here"
                                            value={
                                              task?.userProgress?.submission
                                            }
                                            disabled
                                            icon={
                                              <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <div>1.</div>
                                            <a
                                              href={`${task?.payload?.telegramGroupLink}`}
                                              target="_blank"
                                              className="flex h-[48px] w-full items-center rounded-[8px] border px-4 py-4 text-sm text-[#2F0FD1]"
                                            >
                                              Make a Post
                                            </a>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <div>2.</div>
                                            <TaskSubmissionForm task={task} />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BurstDetailsPage;
