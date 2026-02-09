import BackButton from "@/components/BackButton";
import { getQuest, getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { FaLink, FaUsers } from "react-icons/fa";
import { LuGithub } from "react-icons/lu";
import { RiInstagramFill, RiTwitterXFill } from "react-icons/ri";
import { TASK_TAG_BG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import TasksCard from "@/components/TasksCard";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";
import { Fragment } from "react";
import { timeAgo } from "@/utils";
import { useAuth } from "@/hooks/useAuth";

function TaskDetailsPage() {
  const { taskId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    data: quest,
    isLoading: loadingQuest,
    isError: errorLoadingQuest,
  } = useQuery({
    queryKey: ["quest", taskId],
    queryFn: () => getQuest(taskId),
    enabled: !!taskId,
  });

  console.log({ quest });

  const LIMIT = 3;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT],
    queryFn: () => getQuests({ limit: LIMIT }),
    keepPreviousData: true,
  });

  const quests = questData?.data ?? [];

  return (
    <div>
      <div className="space-y-8">
        <div className="md:hidden">
          <BackButton />
        </div>
        <div className="space-y-16 rounded-[4px] bg-white p-4">
          {loadingQuest ? (
            <Loader />
          ) : errorLoadingQuest ? (
            <Error title="Failed to load community details." />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <img src="/ChartPolar.svg" alt="" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[#050215]">
                      {quest?.community?.communityName}
                    </p>
                    <p className="flex items-center gap-1 text-[14px] text-[#777F90]">
                      <FaUsers />
                      <span className="shrink-0">
                        {quest?.community?.totalMembers > 1
                          ? `${quest?.community?.totalMembers} members`
                          : `${quest?.community?.totalMembers} member`}
                      </span>
                    </p>
                  </div>
                </div>

                <button className="shrink-0 cursor-pointer text-[#2F0FD1]">
                  + <span>Join</span>{" "}
                  <span className="hidden sm:inline">Community</span>
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <div className="space-y-4">
                      <h2 className="text-[20px] font-bold text-[#050215]">
                        {quest?.questTitle}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        <div
                          className={`rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${TASK_TAG_BG[quest.category]}`}
                        >
                          {quest.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
                          <img src="/Gift.svg" alt="" />
                          {/* {task.amount} XLM */} 80 XLM
                        </p>
                        <div className="flex shrink-0 items-center gap-1">
                          <div className="h-1 w-1 rounded-full bg-[#636366]" />
                          <p className="flex gap-1.5 font-semibold text-[#8791A7]">
                            {timeAgo(quest?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-normal text-[#525866]">
                    {quest?.questDescription}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {quest?.community?.communityLinks.map((link, i) => {
                      return (
                        <Fragment key={i}>
                          {link.title === "Website" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <FaLink className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "GitHub" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <RiTwitterXFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "Twitter" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <RiInstagramFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "Instagram" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <LuGithub className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/login");
                        return;
                      }
                    }}
                    className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 hover:bg-[#2F0FD1]/70"
                  >
                    Claim Task
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-[20px] font-semibold text-[#050215]">
              Similar Tasks
            </h2>

            {loadingQuests ? (
              <Loader />
            ) : errorLoadingQuests ? (
              <Error title="Failed to load quests..." />
            ) : quests.length === 0 ? (
              <Empty title="No quests found..." />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {quests.slice(0, 3).map((task, i) => (
                    <TasksCard task={task} key={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
