import { useModalStore } from "@/lib/store/modal-store";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import TagIcon from "@/assets/icons/tag.svg?react";
import InlineButton from "@/ui/InlineButton";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";

export default function DialogInfo() {
  const { dialogInfoModalData, setEditTagsModalOpen } = useModalStore();
  const lp = useLaunchParams();
  if (!dialogInfoModalData) return;

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        paddingTop: ["macos", "tdesktop"].includes(lp.platform)
          ? 40
          : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
      }}
    >
      <img
        loading="lazy"
        src={`https://t.me/i/userpic/320/${dialogInfoModalData.username}.svg`}
        className="h-24 w-24 rounded-full"
        decoding="async"
        alt=""
      />
      <div className="text-xl font-semibold mt-4">
        {dialogInfoModalData.name}
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
      <div className="flex flex-col gap-2 mt-4">
        {dialogInfoModalData.tags?.map((tag) => {
          if (!tag) return null;
          return (
            <div key={tag.title} className="text-sm text-gray-500">
              {tag.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
