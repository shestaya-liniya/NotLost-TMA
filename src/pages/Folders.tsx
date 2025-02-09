import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useModalStore } from "@/lib/zustand-store/modal-store";
import DragSensible from "@/ui/DragSensible";
import { useDragStore } from "@/lib/zustand-store/drag-store";
import { useEffect, useRef, useState } from "react";
import { JazzFolder, RootUserProfile } from "@/lib/jazz/schema";
import { ID } from "jazz-tools";
import {
  jazzCreateNewFolder,
  jazzDeleteFolder,
} from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";

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
      id: ID<JazzFolder>;
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

  const removeFolderHeight = (id: ID<JazzFolder>) => {
    setFoldersHeight((prev) => prev.filter((folder) => folder.id !== id));
  };

  const getFolderTopInset = (index: number) => {
    return foldersHeight
      .slice(0, index)
      .reduce((acc, folder) => acc + folder.height, 0);
  };

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{
          paddingTop:
            "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
        }}
        className="px-4 py-2 shadow-2xl bg-secondary pb-4"
      >
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="overflow-y-auto overscroll-none pb-20 max-h-screen h-full">
        <div className="absolute w-screen">
          <DropFolder jazzProfile={jazzProfile} />
        </div>
        <div
          className={`h-full transition-all duration-300 ease-in-out relative ${
            dropFolderAppear ? "translate-y-14" : "translate-y-0"
          }`}
        >
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
                    folder={folder}
                    setFolderHeight={(height: number) =>
                      setFolderHeight(folder.id, height)
                    }
                    onDeleteFolder={() => {
                      removeFolderHeight(folder.id);
                    }}
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

function InlineButton({
  title,
  onClick,
  Icon,
}: {
  title: string;
  onClick: () => void;
  Icon: React.ReactNode;
}) {
  return (
    <Tappable
      className="px-4 py-2 flex flex-col gap-1 text-link justify-center items-center"
      onClick={onClick}
    >
      {Icon}
      <div className="text-sm font-medium">{title}</div>
    </Tappable>
  );
}

function Folder({
  folder,
  setFolderHeight,
  onDeleteFolder,
}: {
  folder: JazzFolder;
  setFolderHeight: (height: number) => void;
  onDeleteFolder: () => void;
}) {
  const { jazzProfile } = useJazzProfileContext();
  const { draggableItemType } = useDragStore();
  const [expanded, setExpanded] = useState(false);

  const [hidden, setHidden] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      setFolderHeight(ref.current.clientHeight);
    }
  }, [expanded]);

  const handleRemoveFolder = () => {
    setHidden(true);
    setTimeout(() => {
      jazzDeleteFolder(jazzProfile, folder);
      onDeleteFolder();
    }, 300);
  };

  return (
    <div
      ref={ref}
      className={
        hidden
          ? "transition-all duration-300 ease-in-out opacity-0"
          : "opacity-100"
      }
    >
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
            <div className="flex flex-col gap-2">
              <InlineButton
                title="Remove"
                onClick={handleRemoveFolder}
                Icon={<RemoveIcon className="w-4 h-4" />}
              />
            </div>
          </Accordion>
        </div>
      </DragSensible>
    </div>
  );
}
