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
        className="flex flex-col items-center justify-left gap-1 rounded-xl p-2"
      >
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 items-center">
            <img
              loading="lazy"
              src={`https://t.me/i/userpic/320/${props.dialog.username}.svg`}
              className="h-12 w-12 rounded-full"
              decoding="async"
              alt=""
            />
            <span
              className={`px-2 py-[0.5px] text-xs font-normal bg-link/10 text-link rounded-xl`}
            >
              {truncateWord(props.dialog.name || "", 5)}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="bg-green-500/10 mt-1 h-3.5 rounded-sm text-[8px] text-green-500 px-1 flex items-center gap-1 py-1 uppercase">
              fullstack
            </div>
          </div>
        </div>
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
