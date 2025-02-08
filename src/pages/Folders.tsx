import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { useModalStore } from "@/lib/zustand-store/modal-store";
import DragSensible from "@/ui/DragSensible";
import { useDragStore } from "@/lib/zustand-store/drag-store";
import { useState } from "react";

// In that component custom animation is used for the folder height
// To provide smoothest transition, translate animation is used, as height animation is expensive
// To make smooth transition of all folders going down/up when some folder is expanded,
// every folder is positioned in absolute and have a dynamic inset top that is updated on every folder height change
// Such overhead provide best performance for low end devices

const mockFolders = [
  {
    id: 1,
    name: "Folder 1",
    height: 0,
  },
  {
    id: 2,
    name: "Folder 2",
    height: 0,
  },
  {
    id: 3,
    name: "Folder 3",
    height: 0,
  },
  {
    id: 4,
    name: "Folder 4",
    height: 0,
  },
];

export default function Folders() {
  const { setManageDialogsModalOpen } = useModalStore();
  const { draggableItemType } = useDragStore();

  const dropFolderAppear = draggableItemType === "folder";

  const [foldersHeight, setFoldersHeight] = useState(mockFolders);

  const setFolderHeight = (id: number, height: number) => {
    setFoldersHeight((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, height } : folder))
    );
  };

  const getFolderTopInset = (id: number) => {
    return foldersHeight
      .slice(0, id)
      .reduce((acc, folder) => acc + folder.height, 0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="mt-4 overflow-y-auto overscroll-none pb-20 max-h-screen h-full">
        <div className="absolute w-screen">
          <DropFolder />
        </div>
        <div
          className={`h-full transition-all duration-300 ease-in-out relative ${
            dropFolderAppear ? "translate-y-14" : "translate-y-0"
          }`}
        >
          {mockFolders.map((folder) => (
            <div key={folder.id}>
              <div
                className="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
                style={{
                  transform:
                    folder.id !== 1
                      ? `translateY(${getFolderTopInset(folder.id - 1)}px)`
                      : "translateY(0)",
                }}
              >
                <Folder
                  setFolderHeight={
                    (height: number) => setFolderHeight(folder.id, height + 16) // 16 is a margin between folders
                  }
                />
              </div>
            </div>
          ))}
        </div>
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
    <DragSensible additionalCondition={draggableItemType === "folder"}>
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

function Folder({
  setFolderHeight,
}: {
  setFolderHeight: (height: number) => void;
}) {
  const { draggableItemType } = useDragStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <DragSensible additionalCondition={draggableItemType === "contact"}>
      <div className="px-4 py-2">
        <Accordion
          title="Folder 13"
          expanded={expanded}
          setExpanded={setExpanded}
          updateHeight={setFolderHeight}
        >
          <div>Hello</div>
        </Accordion>
      </div>
    </DragSensible>
  );
}
