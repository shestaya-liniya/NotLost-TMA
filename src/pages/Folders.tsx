import { useModalStore } from "@/lib/store/modalStore";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { jazzCreateNewFolder } from "@/lib/jazz/actions/jazzFolder";

import Tappable from "@/ui/Tappable";

import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import Folder from "@/features/folders/Folder";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";

export default function Folders() {
  const { jazzProfile } = useJazzProfileContext();
  const { setGraphModalOpen } = useModalStore();

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{ paddingTop: getMiniAppTopInset() }}
        className="px-4 py-2 bg-secondary border-b-2 border-primary/30"
      >
        <div className="relative grid grid-cols-3 mt-2">
          <div></div>
          <div className="text-link font-semibold grid place-items-center">
            Folders
          </div>
          <div className="flex justify-end">
            <Tappable
              onClick={() => setGraphModalOpen(true)}
              className="text-link pl-2 pr-2 py-2 rounded-xl"
            >
              <GraphIcon className="h-8 w-8 " />
            </Tappable>
          </div>

          {/* <div className="text-accent font-semibold text-center w-full absolute z-10 -top-8">
            NotLost
          </div> */}
        </div>
      </div>
      <div
        style={{
          height: "100%",
          paddingBottom: 40,
        }}
        className={`overflow-y-auto overscroll-none max-h-screen`}
      >
        <div
          className={`h-full transition-all duration-300 ease-in-out relative`}
        >
          {jazzProfile.folders?.map((folder) => {
            if (!folder) return null;
            return (
              <div key={folder.id} className="w-full">
                <Folder folder={folder} />
              </div>
            );
          })}
        </div>
      </div>

      {jazzProfile.folders && jazzProfile.folders.length > 0 ? (
        <Tappable
          className="p-3 rounded-full bg-link fixed bottom-10 right-8 z-50"
          onClick={() => jazzCreateNewFolder(jazzProfile, "New folder")}
        >
          <PlusIcon className="w-7 h-7 text-white" />
        </Tappable>
      ) : (
        <div>
          <div className="fixed bottom-26 right-8 bg-link/10 text-link px-2 py-1 rounded-xl">
            Start by adding a new folder
          </div>
          <Tappable
            className="p-3 rounded-full bg-link fixed bottom-10 right-8 z-50 animate-pulse shadow-link shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
            onClick={() => jazzCreateNewFolder(jazzProfile, "New folder")}
          >
            <PlusIcon className="w-7 h-7 text-white" />
          </Tappable>
        </div>
      )}
    </div>
  );
}
