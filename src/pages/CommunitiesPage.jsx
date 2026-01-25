import CommunitiesCard from "@/components/CommunitiesCard";
import Filter from "@/components/Filter";
import CustomPagination from "@/components/CustomPagination";
import React, { useState } from "react";
import BackButton from "@/components/BackButton";
import CustomSearch from "@/components/Search";
import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "@/services";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Empty from "@/components/Empty";

function CommunitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 10;
  const OFFSET = (currentPage - 1) * LIMIT;

  const {
    data: communitiesData,
    isLoading: loadingCommunities,
    isError: errorLoadingCommunities,
  } = useQuery({
    queryKey: ["communities", LIMIT, OFFSET],
    queryFn: () => getCommunities({ limit: LIMIT, offset: OFFSET }),
    keepPreviousData: true,
  });

  const communities = communitiesData?.data ?? [];
  const totalPages = communitiesData?.totalPages ?? 1;

  console.log({ communitiesData });

  return (
    <div className="bg-white pt-40">
      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-5 pb-10 lg:px-10">
        <BackButton />

        {loadingCommunities ? (
          <Loader />
        ) : errorLoadingCommunities ? (
          <Error title="Failed to load communities..." />
        ) : communities.length === 0 ? (
          <Empty title="No communities found..." />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 lg:items-end">
              <div className="text-[#050215]">
                <h2 className="text-[24px] font-extrabold md:text-[44px]">
                  All Communities ({communitiesData?.totalElements})
                </h2>
                <p className="font-light md:text-[20px]">
                  Explore communities building impactful projects
                </p>
              </div>

              <div className="flex shrink-0 lg:order-3">
                <Filter tag="landing" />
              </div>

              <CustomSearch placeholder="Search community" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((community, i) => (
                <CommunitiesCard
                  community={community}
                  key={i}
                  tag="communities-page"
                />
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

export default CommunitiesPage;
