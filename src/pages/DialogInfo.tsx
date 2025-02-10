import { useModalStore } from "@/lib/store/modal-store";
import { useLaunchParams } from "@telegram-apps/sdk-react";

export default function DialogInfo() {
  const { dialogInfoModalData } = useModalStore();
  const lp = useLaunchParams();

  if (!dialogInfoModalData) return;

  return (
    <div
      className="flex flex-col items-center justify-center"
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
    </div>
  );
}
