import { jazzCreateNewFolder } from "@/lib/jazz/actions/jazz-folder";
import { RootUserProfile } from "@/lib/jazz/schema";
import { useDragStore } from "@/lib/store/drag-store";
import DragSensible from "@/ui/DragSensible";
import { memo } from "react";

function NewFolder({ jazzProfile }: { jazzProfile: RootUserProfile }) {
  const { draggableItemType } = useDragStore();
  return (
    <DragSensible
      sensibleFor="folder"
      onDragEnd={() => {
        jazzCreateNewFolder(jazzProfile, "New folder");
      }}
    >
      <div
        className={`transition-opacity px-6 py-4 duration-300 ease-in-out bg-link/10 text-link text-center font-medium ${
          draggableItemType === "folder" ? "opacity-100" : "opacity-0"
        }`}
      >
        Drop here to create a new folder
      </div>
    </DragSensible>
  );
}

export default memo(NewFolder);
