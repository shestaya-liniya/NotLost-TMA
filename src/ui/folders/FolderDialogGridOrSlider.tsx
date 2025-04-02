import { chunkArray } from "@/helpers/chunkArray";
import { JazzFolder } from "@/lib/jazz/schema";
import { SwiperSlide } from "swiper/react";
import { SwiperSlider } from "../dialog/DialogsSlider";
import DialogWithActions from "../dialog/DialogWithActions";
import { v4 as uuid } from "uuid";

export default function FolderDialogGridOrSlider(props: {
  folder: JazzFolder;
}) {
  if (!props.folder.dialogs) return;

  if (props.folder.dialogs.length === 0) {
    return (
      <div className="text-hint text-center py-4 font-semibold">
        Nothing yet
      </div>
    );
  }

  if (props.folder.dialogs.length > 9) {
    return (
      <div className="-ml-4 -mr-4">
        <SwiperSlider>
          {chunkArray(
            props.folder.dialogs.filter((d) => d !== null),
            9
          ).map((dialogGroup) => (
            <SwiperSlide key={uuid()} className="h-full">
              <div className="grid grid-cols-3 gap-2 h-full">
                {dialogGroup.map((d, index) => (
                  <DialogWithActions
                    key={d.id}
                    dialog={d}
                    folder={props.folder}
                    index={index}
                  />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </SwiperSlider>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {props.folder.dialogs
        .filter((d) => d !== null)
        .map((d, index) => (
          <DialogWithActions
            key={d.id}
            dialog={d}
            folder={props.folder}
            index={index}
          />
        ))}
    </div>
  );
}
