import { endTime, startTime } from "@/utils";
import { useNavigate } from "react-router";

function BurstCard({ burst }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`detail/${encodeURIComponent(burst.id)}`);
  };

  console.log({ burst });

  return (
    <div
      onClick={handleOpen}
      className={`flex cursor-pointer flex-col justify-center gap-6 rounded-[8px] border-2 border-[#F0F4FD] bg-white px-[24px] py-[28px]`}
    >
      <div className={`space-y-2`}>
        <p className="max-w-full truncate overflow-hidden font-semibold whitespace-nowrap text-[#09032A]">
          {burst?.burstTitle}
        </p>
        <p className="text-[15px] text-[#48484A]">
          {new Date(burst?.startDate) > new Date() ? (
            <span className="text-[#09032A]">
              {startTime(burst?.startDate)}
            </span>
          ) : (
            <span className="text-[#09032A]">{endTime(burst?.endDate)}</span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        <div className="w-fit bg-[#D9F3DC] px-3 py-[5px]">{burst.platform}</div>

        <div className="flex items-center gap-2">
          <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
            <img src="/Gift.svg" alt="" />
            {burst.tokensForWinner} {burst.symbol}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-[#636366]" />
            <p className="flex gap-1.5 font-semibold text-[#8791A7]">
              <img src="/UsersThree.svg" alt="" /> {burst.participantCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BurstCard;
