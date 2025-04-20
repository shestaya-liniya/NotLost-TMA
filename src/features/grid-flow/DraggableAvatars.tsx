import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import Draggable from "@/ui/Draggable";

export default function DraggableAvatars() {
  return (
    <Draggable draggableItem={{ type: "custom" }}>
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
