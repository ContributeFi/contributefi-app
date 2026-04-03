import BackButton from "@/components/BackButton";
import { getBurst, submitBurstEntry, selectBurstEntry } from "@/services";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { useState } from "react";
import { endTime } from "@/utils";
import { IoIosCheckmarkCircle } from "react-icons/io";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomInput from "@/components/CustomInput";
import { useAuth } from "@/hooks/useAuth";
import { BsInfoCircleFill, BsSendFill } from "react-icons/bs";
import { PiMegaphoneFill } from "react-icons/pi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BurstSubmissionSchema } from "@/schemas";
import { ImSpinner5 } from "react-icons/im";
import { toast } from "react-toastify";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function BurstDetailsPage() {
  const { burstId } = useParams();
  const [collapsedTasks, setCollapsedTasks] = useState({});

  const toggleTask = (index) => {
    setCollapsedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(BurstSubmissionSchema),
    mode: "onChange",
  });

  console.log({ burstId });

  const { user } = useAuth();

  const [showSelectModal, setShowSelectModal] = useState(false);

  const {
    data: burst,
    isLoading: loadingBurst,
    isError: errorLoadingBurst,
    refetch,
  } = useQuery({
    queryKey: ["burst", burstId],
    queryFn: () => getBurst(burstId),
    enabled: !!burstId,
  });

  const userEntry = burst?.entries?.find((entry) => entry.userId === user?.id);
  const hasSubmitted = !!userEntry;
  const [selectedEntry, setSelectedEntry] = useState(null);

  console.log({ hasSubmitted, userEntry }, burst?.entries, user);

  const { mutate: submitEntryMutation, isPending: submitting } = useMutation({
    mutationFn: (data) =>
      submitBurstEntry(burstId, {
        content: data.suggestedPost,
        postUrl: data.postUrl,
      }),
    onSuccess: () => {
      toast.success("Entry submitted successfully!");
      refetch();
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit entry");
    },
  });

  const { mutate: selectEntryMutation, isPending: selectingEntry } =
    useMutation({
      mutationFn: (entryId) => selectBurstEntry(burstId, entryId),
      onSuccess: () => {
        toast.success("Entry selected successfully!");
        refetch();
        setShowSelectModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to select entry");
      },
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

          {loadingBurst ? (
            <Loader />
          ) : errorLoadingBurst ? (
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

                  <div className="flex flex-2 flex-wrap gap-2">
                    {(burst?.referenceImages || []).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Reference ${idx + 1}`}
                        className="h-10 w-20 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>

                {user?.id !== burst?.creatorId && (
                  <>
                    <Accordion
                      type="single"
                      collapsible
                      className="rounded-[8px] border border-[#8791A7] p-1"
                    >
                      <AccordionItem
                        value="post-trend-link"
                        className={`relative w-full cursor-pointer rounded-[8px] bg-white`}
                      >
                        <AccordionTrigger
                          hideChevron={hasSubmitted}
                          className={`cursor-pointer px-8 py-4 hover:no-underline ${
                            hasSubmitted
                              ? "bg-[#EDF2FF] text-[#1C097D]"
                              : "bg-[#2F0FD1] text-white"
                          }`}
                        >
                          <p className="flex w-full items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                              <PiMegaphoneFill className="text-[30px]" />
                              Post Trend Link and Suggest a Post
                            </span>
                            {hasSubmitted && (
                              <IoIosCheckmarkCircle className="text-[30px] text-[#538E11]" />
                            )}
                          </p>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 rounded-xl bg-white px-[30px] py-4 text-[18px] font-normal">
                          {hasSubmitted ? (
                            <div className="space-y-4">
                              <div className="flex w-full items-center gap-2">
                                1.{" "}
                                <div className="w-full">
                                  <CustomInput
                                    placeholder="Paste Post URL Here"
                                    value={userEntry?.postUrl || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="flex w-full items-center gap-2">
                                2.{" "}
                                <div className="w-full overflow-hidden rounded-[8px] border border-[#D4DCEA] text-[16px]">
                                  <div className="flex items-center justify-between px-4 py-2 text-[#09032A]">
                                    <p className="font-semibold text-[#09032A]">
                                      Suggested Post
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleTask("user-suggestion")
                                      }
                                      className="text-[#09032A]"
                                    >
                                      {collapsedTasks["user-suggestion"] ? (
                                        <IoChevronDown className="text-[30px]" />
                                      ) : (
                                        <IoChevronUp className="text-[30px]" />
                                      )}
                                    </button>
                                  </div>

                                  {!collapsedTasks["user-suggestion"] && (
                                    <div className="bg-white p-4">
                                      <p className="text-[#525866]">
                                        {userEntry?.content}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <form
                              onSubmit={handleSubmit((data) => {
                                submitEntryMutation(data);
                              })}
                              className="space-y-3"
                            >
                              <div className="flex w-full items-center gap-2">
                                1.{" "}
                                <div className="w-full">
                                  <CustomInput
                                    placeholder="Paste Post URL Here"
                                    error={errors?.postUrl?.message}
                                    {...register("postUrl")}
                                  />
                                </div>
                              </div>

                              <div className="flex w-full items-center gap-2">
                                2.{" "}
                                <div className="w-full overflow-hidden rounded-[8px] border border-[#D4DCEA] text-[16px]">
                                  <div className="flex items-center justify-between px-4 py-2 text-[#09032A]">
                                    <p className="font-semibold text-[#09032A]">
                                      Suggest Post for the Trend
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => toggleTask("suggest-post")}
                                      className="text-[#09032A]"
                                    >
                                      {collapsedTasks["suggest-post"] ? (
                                        <IoChevronDown className="text-[30px]" />
                                      ) : (
                                        <IoChevronUp className="text-[30px]" />
                                      )}
                                    </button>
                                  </div>

                                  {!collapsedTasks["suggest-post"] && (
                                    <div className="space-y-4 bg-white p-4">
                                      <Textarea
                                        className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
                                        placeholder="Type post here..."
                                        error={errors?.suggestedPost?.message}
                                        {...register("suggestedPost")}
                                      />

                                      <div className="flex justify-end">
                                        <Button
                                          type="submit"
                                          disabled={submitting}
                                          className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white disabled:opacity-50"
                                        >
                                          {submitting ? (
                                            <ImSpinner5 className="animate-spin" />
                                          ) : (
                                            "Submit Entry"
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </form>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}

                {user?.id === burst?.creatorId && (
                  <>
                    <hr />
                    <div className="space-y-4">
                      {(() => {
                        const winnerEntry = burst?.entries?.find(
                          (entry) => entry.isWinner === true,
                        );
                        const hasWinner = !!winnerEntry;

                        return (
                          <>
                            {!hasWinner && (
                              <div>
                                <h2 className="font-bricolage text-[20px] font-bold text-[#050215]">
                                  Top Entries (5)
                                </h2>
                                <p className="text-[18px] text-[#525866]">
                                  The selected entry gets selected as the winner
                                </p>
                              </div>
                            )}

                            <div className="space-y-4 divide-y">
                              {(() => {
                                const entries =
                                  burst?.entries?.slice(0, 5) || [];
                                const displayEntries = winnerEntry
                                  ? [winnerEntry]
                                  : entries;
                                return displayEntries.map((entry, index) => (
                                  <div key={index} className="py-8">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                      <div className="flex shrink-0 items-center gap-1">
                                        <div className="h-1 w-1 rounded-full bg-[#636366]" />
                                        <p className="font-semibold text-[#09032A]">
                                          {entry?.username}
                                        </p>
                                      </div>

                                      <div className="flex flex-col gap-2 sm:flex-row">
                                        {entry.postUrl && (
                                          <a
                                            href={entry.postUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-md border border-[#2F0FD1] px-4 py-2 text-center text-[#2F0FD1] hover:bg-[#2F0FD1] hover:text-white sm:text-sm"
                                          >
                                            Open Trend Link
                                            <FiArrowUpRight className="text-2xl" />
                                          </a>
                                        )}
                                        {entry.isWinner ? (
                                          <div className="rounded-md bg-[#E2F1FE] px-4 py-2 text-center font-[500] text-[#1082E4]">
                                            Manually Selected
                                          </div>
                                        ) : (
                                          <Button
                                            variant="secondary"
                                            size="lg"
                                            onClick={() => {
                                              setSelectedEntry(entry);
                                              setShowSelectModal(true);
                                            }}
                                          >
                                            Select Entry
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                      <div className="space-y-[6px]">
                                        <p className="text-[16px] font-[400] text-[#525866]">
                                          Suggested Post
                                        </p>
                                        <p className="text-[16px] font-[500] text-[#050215]">
                                          {entry.content}
                                        </p>
                                      </div>

                                      <div className="space-y-[6px]">
                                        <p className="text-[16px] font-[400] text-[#525866]">
                                          AI Refined Post
                                        </p>
                                        <p className="text-[16px] font-[500] text-[#050215]">
                                          AI refined version of the suggested
                                          post will appear here...
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showSelectModal} onOpenChange={setShowSelectModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center">
              <BsSendFill className="text-[40px] text-[#2F0FD1]" />
            </div>
            <DialogTitle className="text-center font-bricolage text-[24px] font-[700]">
              Select Entry
            </DialogTitle>
            <DialogDescription className="mx-auto max-w-[336px] text-center text-[16px] text-[#383C45]">
              The entry you choose will be rewarded as a winner and the
              suggested post will be posted on your social account
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowSelectModal(false)}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => selectEntryMutation(selectedEntry.id)}
                disabled={selectingEntry}
                className="flex-1"
              >
                {selectingEntry ? (
                  <ImSpinner5 className="animate-spin" />
                ) : (
                  "Select & Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BurstDetailsPage;
