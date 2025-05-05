import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import { memo } from "react";

function InboxSection() {
  return (
    <div>
      <div className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2 mt-4">
        <div className="text-xs">Inbox</div>
        <ChevronRightIcon className="h-2 w-2 mt-0.5" />
        <div className="rounded-full text-xs p-0.5 h-4 w-4 bg-red-500/80 grid place-content-center">
          0
        </div>
        <div className="rounded-full text-xs p-0.5 h-4 w-4 bg-secondary grid place-content-center">
          0
        </div>
      </div>
    </div>
  );
}

export default memo(InboxSection);
