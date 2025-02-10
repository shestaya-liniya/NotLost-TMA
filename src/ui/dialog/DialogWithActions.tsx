import { JazzDialog, JazzFolder } from "@/lib/jazz/schema";
import { useRef, useState } from "react";
import Tappable from "../Tappable";
import { DialogTooltip } from "./DialogTooltip";
import { truncateWord } from "@/helpers/truncate-word";

export default function DialogWithActions(props: {
  dialog: JazzDialog;
  folder: JazzFolder;
}) {
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const [dialogWithTooltip, setDialogWithTooltip] = useState<null | JazzDialog>(
    null
  );

  const startPress = (dialog: JazzDialog) => {
    isLongPress.current = false;
    timerRef.current = window.setTimeout(() => {
      setDialogWithTooltip(dialog);
      isLongPress.current = true;
    }, 200);
  };

  const endPress = (username: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;

      if (!isLongPress.current) {
        window.open(`https://t.me/${username}`, "_blank");
      }
    }
  };
  return (
    <div className={`relative`}>
      <Tappable
        onTouchStart={() => {
          startPress(props.dialog);
        }}
        onTouchEnd={() => {
          if (props.dialog.username) {
            endPress(props.dialog.username);
          }
        }}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-2"
      >
        <img
          loading="lazy"
          src={`https://t.me/i/userpic/320/${props.dialog.username}.svg`}
          className="h-12 w-12 rounded-full touch-none"
          decoding="async"
          alt=""
        />
        <span
          className={`px-2 py-[0.5px] text-xs font-normal bg-link/10 text-link rounded-xl`}
        >
          {truncateWord(props.dialog.name || "", 5)}
        </span>
      </Tappable>
      <DialogTooltip
        dialog={props.dialog}
        folder={props.folder}
        showTooltip={props.dialog === dialogWithTooltip}
        closeTooltip={() => {
          setDialogWithTooltip(null);
        }}
      />
    </div>
  );
}
