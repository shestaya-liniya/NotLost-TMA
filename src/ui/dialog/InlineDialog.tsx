import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import { memo } from "react";
import { JazzDialog } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import InlineDialogContent from "./InlineDialogContent";

function InlineDialog(props: {
  dialog: TelegramDialogInfo | JazzDialog;
  unreadCount: number;
}) {
  const setDialogTooltipPosition = useModalStore(
    (state) => state.setDialogTooltipPosition
  );
  const setIsDialogTooltipOpen = useModalStore(
    (state) => state.setIsDialogTooltipOpen
  );
  const setSelectedDialog = useModalStore((state) => state.setSelectedDialog);
  const { dialog, unreadCount } = props;

  const handleActionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDialogTooltipPosition({
      top: rect.top - 10,
      right: 10,
    });
    setIsDialogTooltipOpen(true);
    setSelectedDialog(dialog);
  };

  return (
    <div className="w-full flex gap-4 px-4 py-3 relative">
      <InlineDialogContent
        dialog={dialog}
        unreadCount={unreadCount}
        handleActionsClick={handleActionsClick}
      />
    </div>
  );
}

export default memo(InlineDialog);
