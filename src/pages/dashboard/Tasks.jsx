import BackButton from "@/components/BackButton";
import CustomPagination from "@/components/CustomPagination";
import Heading from "@/components/dashboard/Heading";
import MetricCard from "@/components/dashboard/MetricCard";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import CustomSearch from "@/components/Search";
import Sort from "@/components/Sort";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { TASK_TAG_BG, TASKS_OVERVIEW } from "@/lib/constants";
import { getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaLink, FaUsers } from "react-icons/fa";
import { LuGithub } from "react-icons/lu";
import { RiInstagramFill, RiTwitterXFill } from "react-icons/ri";
import { useLocation } from "react-router";

const TAG = ["Design", "Development", "Growth"];

function Tasks() {
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState("DESC");
  const [taskView, setTaskView] = useState("active-tasks");

  const handleChangeTaskView = (view) => {
    setTaskView(view);
  };

  console.log({ taskView });

  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 10;
  const OFFSET = (currentPage - 1) * LIMIT;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT, OFFSET],
    queryFn: () => getQuests({ limit: LIMIT, offset: OFFSET }),
    keepPreviousData: true,
  });

  const quests = questData?.data ?? [];
  const totalPages = questData?.totalPages ?? 1;

  console.log({ questData });

  const queryParams = new URLSearchParams(location.search);
  const taskTitle = queryParams.get("task");

  console.log({ taskTitle });

  const handleSort = (order) => {
    console.log("Sort by:", order);
    setSortOrder(order);
  };

  return (
    <>
      {taskTitle ? (
        <div className="space-y-8">
          <div className="md:hidden">
            <BackButton />
          </div>
          <div className="space-y-16 rounded-[4px] bg-white p-4">
            <div className="max-w-[700px] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <img src="/ChartPolar.svg" alt="" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[#050215]">
                      {/* {community?.name} */} The Unifier
                    </p>
                    <p className="flex items-center gap-1 text-[14px] text-[#777F90]">
                      <FaUsers />
                      <span className="shrink-0">
                        {/* {community?.numberOfMembers} members */} 64 members
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
                        {taskTitle}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {TAG.map((t, i) => (
                          <div
                            className={`rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${TASK_TAG_BG[t]}`}
                            key={i}
                          >
                            {t}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
                          <img src="/Gift.svg" alt="" />
                          {/* {task.amount} XLM */} 80 XLM
                        </p>
                        <div className="flex shrink-0 items-center gap-1">
                          <div className="h-1 w-1 rounded-full bg-[#636366]" />
                          <p className="flex gap-1.5 font-semibold text-[#8791A7]">
                            {/* <img src="/UsersThree.svg" alt="" />{" "} */}
                            {/* {task.numberOfMembers} */}2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-normal text-[#525866]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore repudiandae laudantium consequatur labore iure neque
                    cumque quasi provident magnam mollitia quas sapiente
                    cupiditate, qui officiis repellat laboriosam asperiores
                    consequuntur eveniet. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Iste deserunt fuga explicabo eligendi
                    corporis earum magni! Minima, laborum quod magnam quas
                    quisquam, provident exercitationem voluptate nihil,
                    explicabo ratione nulla eligendi.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-white p-2">
                      <FaLink className="rounded-[4px] text-[24px] text-[#777F90]" />
                    </div>
                    <div className="bg-white p-2">
                      <RiTwitterXFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                    </div>
                    <div className="bg-white p-2">
                      <RiInstagramFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                    </div>
                    <div className="bg-white p-2">
                      <LuGithub className="rounded-[4px] text-[24px] text-[#777F90]" />
                    </div>
                  </div>

                  <Button className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 hover:bg-[#2F0FD1]/70">
                    Claim Task
                  </Button>
                </div>
              </div>
            </div>
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
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="md:hidden">
              <Heading />
            </div>

            <MetricsContainer>
              {TASKS_OVERVIEW.map((item, index) => (
                <MetricCard key={index}>
                  <div className="rounded-full bg-[#F0F4FD] p-3">
                    {item.icon && (
                      <item.icon
                        className={`inline-block text-[30px] text-[#2F0FD1] ${item.title === "reputation score" && "rotate-270"}`}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[28px] font-bold text-[#050215]">
                      {item.value}
                    </span>
                    <span className="font-medium text-[#7A899B]">
                      {item.title}
                    </span>
                  </div>
                </MetricCard>
              ))}
            </MetricsContainer>
          </div>

          <div className="space-y-4 rounded-[4px] p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="w-full xl:order-2 xl:w-fit">
                <CustomSearch placeholder="Search task" />
              </div>

              <div className="flex w-full flex-1 shrink-0 gap-4 rounded-[8px] bg-[#F7F9FD] p-2 xl:w-1/2">
                <Button
                  onClick={() => handleChangeTaskView("active-tasks")}
                  variant="outline"
                  className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "active-tasks" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                >
                  Active Tasks
                </Button>

                <Button
                  onClick={() => handleChangeTaskView("my-tasks")}
                  variant="outline"
                  className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "my-tasks" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                >
                  My Tasks
                </Button>

                <Button
                  onClick={() => handleChangeTaskView("completed")}
                  variant="outline"
                  className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "completed" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                >
                  Completed
                </Button>
              </div>

              <div className="flex gap-4 xl:order-3">
                <Filter />
                <Sort order={sortOrder} onToggle={handleSort} />
              </div>
            </div>

            {loadingQuests ? (
              <Loader />
            ) : errorLoadingQuests ? (
              <Error title="Failed to load quests..." />
            ) : quests.length === 0 ? (
              <Empty title="No quests found..." />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {quests.map((quest, i) => (
                    <TasksCard task={quest} key={i} tag="task-page" />
                  ))}
                </div>

                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Tasks;
