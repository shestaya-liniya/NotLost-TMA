import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import Draggable from "@/ui/Draggable";
import { useMemo } from "react";
import { v4 } from "uuid";

export default function DraggableAvatars() {
  return (
    <Draggable draggableItem={{ type: "custom", id: useMemo(() => v4(), []) }}>
      <div className="dndnode">
        <img
          src={getTelegramAvatarLink("shestaya_liniya")}
          className="w-12 h-12"
          alt=""
        />
      </div>
    </Draggable>
  );
}
