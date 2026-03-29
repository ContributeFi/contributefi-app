import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function MoreAboutBurst({ sheetIsOpen, setSheetIsOpen }) {
  const isDesktop = useIsDesktop();
  const { requireAuth } = useRequireAuth();

  const side = isDesktop ? "right" : "bottom";

  const handleOpenChange = (open) => {
    if (open) {
      requireAuth(() => setSheetIsOpen(true));
    } else {
      setSheetIsOpen(false);
    }
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer rounded-md bg-[#EDF2FF] px-8 py-5 text-[16px] font-[300] text-[#205CE2] hover:bg-[#2F0FD1] hover:text-white md:w-auto">
          More About Burst
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`bg-white ${side === "bottom" ? "h-[80%]" : "sm:max-w-xl"} px-4`}
      >
        <SheetHeader className="relative">
          <SheetTitle className="font-bricolage text-[28px] font-bold text-[#09032A]">
            How Burst Works
          </SheetTitle>
          <SheetDescription className="font-[300] text-[#525866]">
            Increase your brand or product visibility by engaging in trending
            topics on social media
          </SheetDescription>
        </SheetHeader>

        <ul className="list-disc space-y-4 pl-7 text-[18px] text-[#09032A]">
          <li>
            State the kind of trending conversations you want to engage in on
            the selected social media platform.
          </li>

          <li>Participants suggest trends and posts for the trends.</li>

          <li>
            Contribute select top entries and auto-post winners’ suggested
            posts.
          </li>

          <li>
            The selected submission gets posted under your social media handle.
          </li>

          <li>
            This allows you participate in trending and relatable topics
            suggested by other active social media users.
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}

export default MoreAboutBurst;
