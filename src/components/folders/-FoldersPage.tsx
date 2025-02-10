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
import SearchIcon from "@/assets/icons/search.svg?react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import Button from "@/ui/Button";
import { getElementHeightById } from "@/helpers/css/get-element-height";
import { getCssVariable } from "@/helpers/css/get-css-variable";
// In that component custom animation is used for the folder height
// To provide smoothest transition, translate animation is used, as height animation is expensive
// To make smooth transition of all folders going down/up when some folder is expanded,
// every folder is positioned in absolute and have a dynamic inset top that is updated on every folder height change
// Such overhead provide best performance for low end devices

export default function Folders() {
  const { jazzProfile } = useJazzProfileContext();

  const { setManageDialogsModalOpen, manageDialogsModalOpen } = useModalStore();
  const { draggableItemType } = useDragStore();

  const lp = useLaunchParams();

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

  const tabBarHeight = getElementHeightById("tab-bar");
  const manageDialogsModalHeight = getElementHeightById("manage-dialogs-modal");

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{
          paddingTop: ["macos", "tdesktop"].includes(lp.platform)
            ? 40
            : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
        }}
        className="px-4 py-2 bg-secondary pb-4 border-b-2 border-link/10"
      >
        <div className="relative">
          <Input
            label="Search"
            value=""
            onInput={() => {}}
            before={<SearchIcon className="h-4 w-4 opacity-50" />}
          />
          <div className="text-accent font-semibold text-center w-full absolute z-10 -top-7">
            NotLost
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Button title="Filter" onClick={() => {}} />
          <Button title="Filter" onClick={() => {}} />
          <Button title="Filter" onClick={() => {}} />
        </div>
      </div>
      <div
        style={{
          height: manageDialogsModalOpen
            ? `calc(100% - ${manageDialogsModalHeight}px - ${tabBarHeight}px ${
                !["macos", "tdesktop"].includes(lp.platform)
                  ? `- ${getCssVariable("tg-viewport-safe-area-inset-bottom")}px`
                  : ""
              } ) `
            : "100%",
        }}
        className={`overflow-y-auto overscroll-none max-h-screen`}
      >
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
