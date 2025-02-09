import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { useModalStore } from "@/lib/store/modal-store";
import { useDragStore } from "@/lib/store/drag-store";
import { useState } from "react";
import { JazzFolder } from "@/lib/jazz/schema";
import { ID } from "jazz-tools";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Folder from "@/components/folders/Folder";
import NewFolder from "@/components/folders/NewFolder";

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
          <NewFolder jazzProfile={jazzProfile} />
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
