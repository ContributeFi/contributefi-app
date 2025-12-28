import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import GrowthQuest from "./GrowthQuest";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import OnChainQuest from "./OnChainQuest";
import TechnicalQuest from "./TechnicalQuest";

function NewQuest({ sheetIsOpen, setSheetIsOpen }) {
  const isDesktop = useIsDesktop();

  const side = isDesktop ? "right" : "bottom";

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 hover:bg-[#2F0FD1]/70">
          Create Quest
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`bg-white ${side === "bottom" ? "h-[80%]" : "sm:max-w-xl"} px-4`}
      >
        <SheetHeader className="relative">
          <SheetTitle className="text-[28px] font-bold text-[#09032A]">
            Create New Quest
          </SheetTitle>
          <SheetDescription className="font-[300] text-[#525866]">
            Which type of quest do you want to create?
          </SheetDescription>
        </SheetHeader>

        <GrowthQuest
        // sheetIsOpen={sheetIsOpen}
        // setSheetIsOpen={setSheetIsOpen}
        />
        <OnChainQuest
        // sheetIsOpen={sheetIsOpen}
        // setSheetIsOpen={setSheetIsOpen}
        />
        <TechnicalQuest
        // sheetIsOpen={sheetIsOpen}
        // setSheetIsOpen={setSheetIsOpen}
        />
      </SheetContent>
    </Sheet>
  );
}

export default NewQuest;
