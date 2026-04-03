import BurstCard from "@/components/BurstCard";
import CustomPagination from "@/components/CustomPagination";
import MoreAboutBurst from "@/components/dashboard/MoreAboutBurst";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetBursts } from "@/hooks/useGetBursts";
import React, { useState } from "react";
import { PiMegaphoneFill } from "react-icons/pi";
import { useNavigate } from "react-router";

function Burst() {
  const [burstView, setBurstView] = useState("all");
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const LIMIT = 10;
  const OFFSET = currentPage;

  const { bursts, loadingBursts, errorLoadingBursts, totalPages, refetch } =
    useGetBursts(LIMIT, OFFSET, "DESC", burstView);

  const handleChangeBurstView = (view) => {
    if (!isAuthenticated && (view === "created" || view === "participated")) {
      navigate("/get-started");
      return;
    }
    setBurstView(view);
    setCurrentPage(1);
    refetch();
  };

  const handleCreateBurst = () => {
    if (!isAuthenticated) {
      navigate("/get-started");
      return;
    }
    navigate("/burst/new-burst");
  };

  return (
    <>
      <h2 className="mb-2 text-[24px] font-bold text-[#050215] md:text-2xl">
        Active Bursts
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full items-center gap-2 min-[872px]:w-auto">
          {/* <Filter /> */}

          <div className="flex w-full gap-2 overflow-hidden rounded-[8px] bg-[#F7F9FD] p-2">
            <button
              onClick={() => handleChangeBurstView("all")}
              className={`flex-1 cursor-pointer text-sm font-medium transition-all ${burstView === "all" ? "rounded-[2px] bg-[#EDF2FF] text-[#2F0FD1] shadow-xs" : "text-[#525866]"} p-2 px-6 text-[14px] hover:bg-[#EDF2FF] hover:text-[#2F0FD1]`}
            >
              All
            </button>

            <button
              onClick={() => handleChangeBurstView("created")}
              className={`flex-1 cursor-pointer text-sm font-medium transition-all ${burstView === "created" ? "rounded-[2px] bg-[#EDF2FF] text-[#2F0FD1] shadow-xs" : "text-[#525866]"} p-2 px-6 text-[14px] hover:bg-[#EDF2FF] hover:text-[#2F0FD1]`}
            >
              Created
            </button>

            <button
              onClick={() => handleChangeBurstView("participated")}
              className={`flex-1 cursor-pointer text-sm font-medium transition-all ${burstView === "participated" ? "rounded-[2px] bg-[#EDF2FF] text-[#2F0FD1] shadow-xs" : "text-[#525866]"} p-2 px-6 text-[14px] hover:bg-[#EDF2FF] hover:text-[#2F0FD1]`}
            >
              Participated
            </button>
          </div>
        </div>

        <Button
          onClick={handleCreateBurst}
          className="w-full cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white min-[872px]:w-auto"
        >
          Create New Burst
        </Button>
      </div>

      <div className="mt-4">
        {loadingBursts ? (
          <Loader />
        ) : errorLoadingBursts ? (
          <Error title="Failed to load bursts." />
        ) : bursts?.data?.length === 0 ? (
          <div className="col-span-full flex h-[calc(100vh-270px)] flex-col items-center justify-center gap-8 bg-white p-4 text-center min-[872px]:h-[calc(100vh-220px)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F9FD] text-[#2F0FD1]">
              <PiMegaphoneFill className="h-12 w-12" />
            </div>
            <div className="max-w-md space-y-4">
              <p className="font-bricolage text-[24px] font-bold text-[#050215]">
                Increase your brand or product visibility
              </p>
              <p className="text-[18px] text-[#525866]">
                Burst helps you to seamlessly engage in trends on social media
              </p>
            </div>

            <MoreAboutBurst
              sheetIsOpen={sheetIsOpen}
              setSheetIsOpen={setSheetIsOpen}
            />
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {bursts?.data?.map((burst, i) => (
                <BurstCard burst={burst} key={i} />
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
    </>
  );
}

export default Burst;
