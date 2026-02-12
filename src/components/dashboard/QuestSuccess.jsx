import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

function QuestSuccess({ openQuestSuccess, setOpenQuestSuccess }) {
  return (
    <Dialog open={openQuestSuccess} onOpenChange={setOpenQuestSuccess}>
      <DialogContent className="scrollbar-hidden max-h-[calc(100vh-150px)] overflow-scroll bg-white sm:max-w-[668px]">
        <DialogHeader className="hidden">
          <DialogTitle className="text-left text-[18px] text-[#050215] sm:text-[24px]">
            Successful
          </DialogTitle>
          <DialogDescription className="sr-only">Successful</DialogDescription>
        </DialogHeader>

        <div className="space-y-10 text-center">
          <img src="/success.svg" alt="" className="mx-auto" />

          <div className="space-y-3">
            <p className="text-2xl font-bold text-[#00072D]">Successful!</p>
            <p className="font-normal text-[#383C45]">
              Your quest has been successfully published
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              type="submit"
              className="w-[48%]"
            >
              Share Quest
            </Button>

            <Button
              variant="secondary"
              size="lg"
              type="submit"
              className="w-[48%]"
            >
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuestSuccess;
