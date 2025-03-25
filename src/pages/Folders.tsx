import Tappable from "@/ui/Tappable";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import { useModalStore } from "@/lib/store/modal-store";
import { useDragStore } from "@/lib/store/drag-store";
import { useEffect, useState } from "react";
import { JazzFolder } from "@/lib/jazz/schema";
import { ID } from "jazz-tools";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Folder from "@/ui/folders/Folder";
import NewFolder from "@/ui/folders/NewFolder";

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getElementHeightById } from "@/helpers/css/get-element-height";
import { getCssVariable } from "@/helpers/css/get-css-variable";

import PlusIcon from "@/assets/icons/plus.svg?react";
import { jazzCreateNewFolder } from "@/lib/jazz/actions/jazz-folder";

// In that component custom animation is used for the folder height
// To provide smoothest transition, translate animation is used, as height animation is expensive
// To make smooth transition of all folders going down/up when some folder is expanded,
// every folder is positioned in absolute and have a dynamic inset top that is updated on every folder height change
// Such overhead provide best performance for low end devices

export default function Folders() {
  const { jazzProfile } = useJazzProfileContext();

  const { manageDialogsModalOpen, setSettingsModalOpen, setGraphModalOpen } =
    useModalStore();
  const { draggableItemType } = useDragStore();

  const lp = retrieveLaunchParams();

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

  /* const getFolderTopInset = (index: number) => {
    return foldersHeight
      .slice(0, index)
      .reduce((acc, folder) => acc + folder.height, 0);
  }; */

  const tabBarHeight = getElementHeightById("tab-bar");

  const [manageDialogsHeight, setManageDialogsModalHeight] = useState(0);

  useEffect(() => {
    const modal = document.getElementById("manage-dialogs-modal");
    if (modal) {
      setManageDialogsModalHeight(modal.getBoundingClientRect().height);
    }
  }, [manageDialogsModalOpen]);

  console.log(foldersHeight);

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{
          paddingTop: ["macos", "tdesktop"].includes(lp.tgWebAppPlatform)
            ? 40
            : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
        }}
        className="px-4 py-2 bg-secondary pb-4 border-b-2 border-primary/30"
      >
        <div className="relative flex justify-between mt-2">
          <Tappable
            onClick={() => setSettingsModalOpen(true)}
            className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
          >
            <SettingsIcon className="h-7 w-7 " />
          </Tappable>
          <Tappable
            onClick={() => setGraphModalOpen(true)}
            className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
          >
            <GraphIcon className="h-8 w-8 " />
          </Tappable>

          {/* <div className="text-accent font-semibold text-center w-full absolute z-10 -top-8">
            NotLost
          </div> */}
        </div>

        {/* <div className="flex items-center gap-2 mt-2">
          <Button title="Type" onClick={() => {}} />
          <Button title="Tag" onClick={() => {}} />
          <Button title="Date" onClick={() => {}} />
        </div> */}
      </div>
      <div
        style={{
          height: manageDialogsModalOpen
            ? `calc(100% - ${manageDialogsHeight}px - ${tabBarHeight}px ${
                !["macos", "tdesktop", "android", "ios"].includes(
                  lp.tgWebAppPlatform
                )
                  ? `- ${getCssVariable("tg-viewport-safe-area-inset-bottom")}px`
                  : ""
              } ) `
            : "100%",
          paddingBottom: 40,
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
          {jazzProfile.folders?.map((folder) => {
            if (!folder) return null;
            return (
              <div key={folder.id}>
                <div
                  className="w-full transition-all duration-200 ease-in-out animate-fadeIn"
                  /* style={{
                    zIndex: 99 - index,
                    transform:
                      index !== 0
                        ? `translateY(${getFolderTopInset(index)}px)`
                        : "translateY(0)",
                  }} */
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
        onClick={() => jazzCreateNewFolder(jazzProfile, "New folder")}
      >
        <PlusIcon className="w-7 h-7 text-white" />
      </Tappable>
    </div>
  );
}
