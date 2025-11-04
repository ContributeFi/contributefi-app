import { COMMUNITY_TAG_BG } from "@/lib/constants";
import { useNavigate } from "react-router";

function CommunitiesCard({ community, tag }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    if (tag === "home-page") return;
    if (tag === "communities-page") return;
    if (tag === "overview") {
      const params = new URLSearchParams(window.location.search);
      params.set("community", community.id);
      navigate(`/dashboard/communities?${params.toString()}`, {
        replace: false,
      });
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set("community", community.id);
    navigate(`?${params.toString()}`, { replace: false });
  };
  return (
    <div
      className={`flex flex-col justify-center gap-8 rounded-[8px] border-2 border-[#F0F4FD] bg-white px-[24px] py-[28px]`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <img src="/ChartPolar.svg" alt="" />
            <div className="space-y-1">
              <p className="font-semibold text-[#050215]">
                {community.communityName}
              </p>
              <p className="flex gap-1 text-[14px] text-[#2F0FD1]">
                <img src="/UsersThree (1).svg" alt="" />{" "}
                <span className="shrink-0">
                  {community.totalMembers} members
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* {community.tag.map((t, i) => (
              <div
                className={`rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${COMMUNITY_TAG_BG[t]}`}
                key={i}
              >
                {t}
              </div>
            ))} */}
          </div>
        </div>

        <p className="text-sm font-light text-[#050215]">
          {community.communityDescription}
        </p>
      </div>

      <div className="flex items-end justify-between rounded-[4px] border-[0.5px] border-[#F0F4FD] bg-[#F7F9FD] p-4">
        <div className="space-y-2 text-sm font-normal text-[#525866]">
          <div className="flex gap-1.5">
            <img src="/Briefcase.svg" alt="" />
            <span> {community.newTasks} new tasks</span>
          </div>
          <div className="flex gap-1.5">
            <img src="/Coins.svg" alt="" />
            <span>{community.amountSpent} spent</span>
          </div>
        </div>

        <button
          onClick={handleJoin}
          className="cursor-pointer font-medium text-[#2F0FD1]"
        >
          {" "}
          + Join
        </button>
      </div>
    </div>
  );
}

export default CommunitiesCard;
