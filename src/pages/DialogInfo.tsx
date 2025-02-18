import { useModalStore } from "@/lib/store/modal-store";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import TagIcon from "@/assets/icons/tag.svg?react";
import InlineButton from "@/ui/InlineButton";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import Tag from "@/ui/Tag";

export default function DialogInfo() {
  const { dialogInfoModalDialog: dialog, setEditTagsModalOpen } =
    useModalStore();
  const lp = retrieveLaunchParams();

  if (!dialog) return;

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        paddingTop: ["macos", "tdesktop"].includes(lp.tgWebAppPlatform)
          ? 40
          : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
      }}
    >
      <img
        loading="lazy"
        src={`https://t.me/i/userpic/320/${dialog.username}.svg`}
        className="h-24 w-24 rounded-full"
        decoding="async"
        alt=""
      />
      <div className="text-xl font-semibold mt-4">{dialog.name}</div>
      <div className="flex gap-2 mt-4 flex-wrap px-4 justify-center">
        {dialog.tags?.map((tag) => {
          if (!tag) return null;
          return (
            <Tag
              key={tag.title}
              title={tag.title}
              color={tag.color}
              size="xl"
            />
          );
        })}
      </div>
      <div className="flex gap-2 mt-4">
        <InlineButton
          title="Edit tags"
          Icon={<TagIcon className="h-6 w-6 text-link pt-1" />}
          onClick={() => setEditTagsModalOpen(true)}
        />
        <InlineButton
          title="Add note"
          Icon={<PencilIcon className="h-6 w-6 text-link pt-1" />}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
