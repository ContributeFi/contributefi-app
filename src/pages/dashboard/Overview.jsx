import CommunitiesCard from "@/components/CommunitiesCard";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { OVERVIEW, TASKS } from "@/lib/constants";
import OverviewHeading from "./OverviewHeading";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import MetricCard from "@/components/dashboard/MetricCard";
import Heading from "@/components/dashboard/Heading";
import { useNavigate } from "react-router";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import { getCommunities } from "@/services";
import { useQuery } from "@tanstack/react-query";

function Overview() {
  const navigate = useNavigate();

  const LIMIT = 6;
  const OFFSET = 1;

  const {
    data: communitiesData,
    isLoading: loadingCommunities,
    isError: errorLoadingCommunities,
  } = useQuery({
    queryKey: ["communities", LIMIT, OFFSET],
    queryFn: () => getCommunities({ limit: LIMIT, offset: OFFSET }),
    keepPreviousData: true,
  });

  const communities = communitiesData?.data || [];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="md:hidden">
          <Heading />
        </div>

        <MetricsContainer>
          {OVERVIEW.map((item, index) => (
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
                  {item.title === "amount earned" && "$"}
                  {item.value}
                  {item.title === "reputation score" && <small> / 10</small>}
                </span>
                <span className="font-medium text-[#7A899B]">{item.title}</span>
              </div>
            </MetricCard>
          ))}
        </MetricsContainer>
      </div>

      <div className="space-y-5">
        <OverviewHeading
          title="Open Tasks"
          description="Explore available tasks"
        >
          <Button
            onClick={() => navigate("/dashboard/tasks")}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            View All
          </Button>
        </OverviewHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {TASKS.slice(0, 6).map((task, i) => (
            <TasksCard task={task} key={i} tag="overview" />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <OverviewHeading
          title="Communities"
          description="Discover and Join communities building impactful projects"
          large={true}
        >
          <div className="flex w-full gap-4">
            <Button
              onClick={() => navigate("/dashboard/communities")}
              variant="outline"
              size="lg"
              className="flex-1 bg-white"
            >
              View All
            </Button>

            <div className="w-1/2 sm:flex-1">
              <CreateCommunityForm />
            </div>
          </div>
        </OverviewHeading>

        {loadingCommunities ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        ) : errorLoadingCommunities ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-2xl font-bold">Failed to load communities...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-2xl font-bold">No communities found...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {communities.map((community, i) => (
              <CommunitiesCard community={community} key={i} tag="overview" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;
