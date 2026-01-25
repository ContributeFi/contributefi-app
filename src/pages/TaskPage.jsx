import BackButton from "@/components/BackButton";
import CustomPagination from "@/components/CustomPagination";
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import CustomSearch from "@/components/Search";
import TasksCard from "@/components/TasksCard";
import { getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

function TaskPage() {
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

  return (
    <div className="bg-white pt-40">
      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-5 pb-10 lg:px-10">
        <BackButton />

        {loadingQuests ? (
          <Loader />
        ) : errorLoadingQuests ? (
          <Error title="Failed to load quests..." />
        ) : quests.length === 0 ? (
          <Empty title="No quests found..." />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 lg:items-end">
              <div className="text-[#050215]">
                <h2 className="text-[24px] font-extrabold md:text-[44px]">
                  Available Tasks ({questData.totalElements})
                </h2>
                <p className="font-light md:text-[20px]">
                  Explore list of available tasks
                </p>
              </div>

              <div className="flex shrink-0 lg:order-3">
                <Filter tag="landing" />
              </div>

              <CustomSearch placeholder="Search task" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}

export default TaskPage;
