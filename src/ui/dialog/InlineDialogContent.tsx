import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { JazzDialog } from "@/lib/jazz/schema";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import { memo } from "react";
import Tag from "../Tag";
import Tappable from "../Tappable";
import MoreIcon from "@/assets/icons/more.svg?react";

function InlineDialogContent(props: {
  dialog: TelegramDialogInfo | JazzDialog;
  unreadCount: number;
  handleActionsClick: (e: React.MouseEvent) => void;
}) {
  const { dialog, unreadCount, handleActionsClick } = props;

  return (
    <div className="w-full flex gap-4 relative">
      <img
        src={getTelegramAvatarLink(dialog.username)}
        className="h-14 w-14 rounded-full"
        alt=""
      />
      <div className="flex-1 flex-col">
        <div className="font-medium">
          {dialog instanceof JazzDialog ? dialog.name : dialog.label}
        </div>
        <div className="text-link text-xs">@{dialog.username}</div>
        {dialog instanceof JazzDialog && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {dialog.tags
              ?.filter((t) => t !== null)
              .map((t) => (
                <Tag key={t.id} title={t?.title} size="md" color={t.color} />
              ))}
          </div>
        )}
        <div className="w-full h-[1px] bg-primary mt-2 absolute -bottom-3 left-16"></div>
      </div>
      {unreadCount > 0 && (
        <div className="rounded-full text-secondary bg-link self-center p-1 min-w-6 text-xs grid place-content-center font-semibold">
          {unreadCount}
        </div>
      )}

      <div className="self-center" onClick={handleActionsClick}>
        <Tappable>
          <MoreIcon className="w-4 h-4 text-link rotate-90" />
        </Tappable>
      </div>
    </div>
  );
}

export default memo(InlineDialogContent);
