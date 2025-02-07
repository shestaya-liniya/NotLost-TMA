import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { useModalStore } from "@/lib/zustand-store/modal-store";
import DragSensible from "@/ui/DragSensible";
import { useDragStore } from "@/lib/zustand-store/drag-store";

export default function Folders() {
  const { setManageDialogsModalOpen } = useModalStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="mt-4 overflow-y-auto overscroll-none pb-20 max-h-screen">
        <DropFolder />
        <Folder />
        <Folder />
        <Folder />
        <Folder />
        <Folder />
        <Folder />
        <Folder />
      </div>

      <Tappable
        className="p-3 rounded-full bg-link fixed bottom-10 right-8 z-50"
        onClick={() => setManageDialogsModalOpen(true)}
      >
        <PencilIcon className="w-7 h-7" />
      </Tappable>
    </div>
  );
}

function DropFolder() {
  const { draggableItemType } = useDragStore();
  return (
    <>
      {draggableItemType === "folder" && (
        <DragSensible additionalCondition={draggableItemType === "folder"}>
          <div className="px-6 py-4 bg-link/10 text-link text-center font-medium">
            Drop here to create a new folder
          </div>
        </DragSensible>
      )}
    </>
  );
}

function Folder() {
  const { draggableItemType } = useDragStore();
  return (
    <DragSensible additionalCondition={draggableItemType === "contact"}>
      <div className="px-4 py-2">
        <Accordion title="Folder 13">
          <div>Hello</div>
        </Accordion>
      </div>
    </DragSensible>
  );
}
