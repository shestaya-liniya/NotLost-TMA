import { JazzDialog, JazzFolder } from "@/lib/jazz/schema";
import { useState } from "react";
import Tappable from "../Tappable";
import { DialogTooltip } from "./DialogTooltip";
import { truncateWord } from "@/helpers/truncate-word";
import Tag from "../Tag";

export default function DialogWithActions(props: {
  dialog: JazzDialog;
  folder: JazzFolder;
}) {
  const [dialogWithTooltip, setDialogWithTooltip] = useState<null | JazzDialog>(
    null
  );
  return (
    <div className={`relative`}>
      <Tappable
        onClick={() => {
          window.open(`https://t.me/${props.dialog.username}`, "_blank");
        }}
        onLongPress={() => {
          setDialogWithTooltip(props.dialog);
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
            {props.dialog.tags?.map((tag) => {
              if (!tag) return;
              return (
                <Tag key={tag.title} title={tag.title} color={tag.color} />
              );
            })}
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
