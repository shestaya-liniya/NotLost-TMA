import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { useModalStore } from "@/lib/zustand-store/modal-store";
import DragSensible from "@/ui/DragSensible";
import { useDragStore } from "@/lib/zustand-store/drag-store";
import { useEffect, useRef, useState } from "react";
import { JazzFolder, RootUserProfile } from "@/lib/jazz/schema";
import { ID } from "jazz-tools";
import { jazzCreateNewFolder } from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { CoMarker } from "jazz-tools/src/internal.js";

// In that component custom animation is used for the folder height
// To provide smoothest transition, translate animation is used, as height animation is expensive
// To make smooth transition of all folders going down/up when some folder is expanded,
// every folder is positioned in absolute and have a dynamic inset top that is updated on every folder height change
// Such overhead provide best performance for low end devices

export default function Folders() {
  const { jazzProfile } = useJazzProfileContext();

  const { setManageDialogsModalOpen } = useModalStore();
  const { draggableItemType } = useDragStore();

  const dropFolderAppear = draggableItemType === "folder";

  const [foldersHeight, setFoldersHeight] = useState<
    {
      id: ID<JazzFolder> | ID<JazzFolder & CoMarker> | undefined;
      height: number;
    }[]
  >([]);

  const setFolderHeight = (id: ID<JazzFolder>, height: number) => {
    setFoldersHeight((prev) => {
      if (prev.find((folder) => folder.id === id)) {
        return prev.map((folder) =>
          folder.id === id ? { id, height } : folder
        );
      }
      return [...prev, { id, height }];
    });
  };

  const getFolderTopInset = (index: number) => {
    return foldersHeight
      .slice(0, index)
      .reduce((acc, folder) => acc + folder.height, 0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="mt-4 overflow-y-auto overscroll-none pb-20 max-h-screen h-full">
        <div className="absolute w-screen">
          <DropFolder jazzProfile={jazzProfile} />
        </div>
        <div
          className={`h-full transition-all duration-300 ease-in-out relative ${
            dropFolderAppear ? "translate-y-14" : "translate-y-0"
          }`}
        >
          <div></div>
          {jazzProfile.folders?.map((folder, index) => {
            if (!folder) return null;
            return (
              <div key={folder.id}>
                <div
                  className="absolute top-0 left-0 w-full transition-all duration-200 ease-in-out animate-fadeIn"
                  style={{
                    transform:
                      index !== 0
                        ? `translateY(${getFolderTopInset(index)}px)`
                        : "translateY(0)",
                  }}
                >
                  <Folder
                    setFolderHeight={(height: number) =>
                      setFolderHeight(folder.id, height)
                    }
                  />
                </div>
              </div>
            );
          })}
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

function DropFolder({ jazzProfile }: { jazzProfile: RootUserProfile }) {
  const { draggableItemType } = useDragStore();
  return (
    <DragSensible
      additionalCondition={draggableItemType === "folder"}
      onDragEnd={() => {
        jazzCreateNewFolder(jazzProfile, "New Folder");
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

function Folder({
  setFolderHeight,
}: {
  setFolderHeight: (height: number) => void;
}) {
  const { draggableItemType } = useDragStore();
  const [expanded, setExpanded] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      setFolderHeight(ref.current.clientHeight);
    }
  }, [expanded]);

  return (
    <div ref={ref}>
      <DragSensible
        additionalCondition={draggableItemType === "contact"}
        onDragEnd={() => {}}
      >
        <div className="px-4 py-2">
          <Accordion
            title="Folder 13"
            expanded={expanded}
            setExpanded={setExpanded}
          >
            <div>Hello</div>
          </Accordion>
        </div>
      </DragSensible>
    </div>
  );
}
