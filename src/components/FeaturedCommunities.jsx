import { useNavigate } from "react-router";
import CommunitiesCard from "./CommunitiesCard";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "@/services";
import Loader from "./Loader";
import Error from "./Error";
import Empty from "./Empty";

function FeaturedCommunities() {
  const navigate = useNavigate();

  const LIMIT = 6;

  const {
    data: communitiesData,
    isLoading: loadingCommunities,
    isError: errorLoadingCommunities,
  } = useQuery({
    queryKey: ["communities", LIMIT],
    queryFn: () => getCommunities({ limit: LIMIT }),
    keepPreviousData: true,
  });

  const communities = communitiesData?.data ?? [];

  return (
    <div className="bg-[#F7F9FD]">
      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-5 py-10 md:py-[104px]">
        <div className="mx-auto max-w-[1200px] space-y-8 text-center text-[#050215]">
          <h2 className="text-[32px] font-extrabold md:text-[44px]">
            Featured Communities
          </h2>

          <p className="mx-auto max-w-[800px] text-[18px] font-light md:text-[20px]">
            Join thousands of contributors making impact across decentralized
            communities.
          </p>
        </div>

        {loadingCommunities ? (
          <Loader />
        ) : errorLoadingCommunities ? (
          <Error title="Failed to load communities..." />
        ) : communities.length === 0 ? (
          <Empty title="No communities found..." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
            {communities.map((community, i) => (
              <CommunitiesCard community={community} key={i} tag="home-page" />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => {
              navigate("/communities");
            }}
            size="lg"
            variant="secondary"
          >
            Explore all Communities
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCommunities;
