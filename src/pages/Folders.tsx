import { useModalStore } from "@/lib/store/modalStore";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { jazzCreateNewFolder } from "@/lib/jazz/actions/jazzFolder";

import Tappable from "@/ui/Tappable";

import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import SearchIcon from "@/assets/icons/search-icon.svg?react";
import SearchIconInput from "@/assets/icons/search.svg?react";

import Folder from "@/features/folders/Folder";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { useEffect, useState } from "react";
import Input from "@/ui/Input";
import { AnimatePresence, motion } from "framer-motion";
import { JazzFolder } from "@/lib/jazz/schema";

export default function Folders() {
  const { jazzProfile } = useJazzProfileContext();
  const { setSettingsModalOpen, setGraphModalOpen } = useModalStore();

  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredFolders, setFilteredFolders] = useState<JazzFolder[]>([]);
  const allFolders = jazzProfile.folders
    ?.filter((f) => f !== null)
    .flatMap((folder) => {
      return [folder, ...getAllNestedFolders(folder)];
    });

  useEffect(() => {
    if (isSearching && searchValue && allFolders) {
      setFilteredFolders(
        allFolders.filter((folder) =>
          folder.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setFilteredFolders([]);
    }
  }, [searchValue, isSearching]);

  if (!jazzProfile.folders) return;

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{ paddingTop: getMiniAppTopInset() }}
        className="px-4 py-2 bg-secondary border-b-2 border-primary/30"
      >
        <div className="relative flex justify-between items-center">
          <Tappable
            onClick={() => setSettingsModalOpen(true)}
            className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
          >
            <SettingsIcon className="h-7 w-7 " />
          </Tappable>
          <AnimatePresence>
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 mx-4 flex gap-4"
              >
                <Input
                  label="Search"
                  value={searchValue}
                  onInput={setSearchValue}
                  className="bg-primary py-1"
                  before={<SearchIconInput className="h-4 w-4 opacity-50" />}
                  onBlur={() => {
                    if (searchValue.length === 0) {
                      setIsSearching(false);
                    }
                  }}
                />
              </motion.div>
            ) : (
              <div className="font-semibold text-link ml-12">Folders</div>
            )}
          </AnimatePresence>
          <div className="flex gap-1">
            {!isSearching && (
              <Tappable
                onClick={() => setIsSearching(true)}
                className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
              >
                <SearchIcon className="h-6 w-6 " />
              </Tappable>
            )}

            <Tappable
              onClick={() => setGraphModalOpen(true)}
              className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
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
          <ListOfFolders
            isSearching={isSearching}
            folders={jazzProfile.folders as JazzFolder[]}
            filteredFolders={filteredFolders}
          />
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

const ListOfFolders = (props: {
  isSearching: boolean;
  filteredFolders: JazzFolder[];
  folders: JazzFolder[];
}) => {
  if (props.isSearching && props.filteredFolders.length === 0) {
    return (
      <div className="text-center text-link font-semibold mt-4">
        Nothing found
      </div>
    );
  }

  if (props.isSearching) {
    return props.filteredFolders.map((folder) => {
      if (!folder) return null;
      return (
        <div key={folder.id} className="w-full">
          <Folder folder={folder} />
        </div>
      );
    });
  }

  return props.folders.map((folder) => {
    if (!folder) return null;
    return (
      <div key={folder.id} className="w-full">
        <Folder folder={folder} />
      </div>
    );
  });
};

const getAllNestedFolders = (
  folder: JazzFolder,
  folders: JazzFolder[] = []
): JazzFolder[] => {
  folder.nestedFolders
    ?.filter((f) => f !== null)
    .forEach((f) => {
      folders.push(f);
      if (f.nestedFolders && f.nestedFolders.length > 0) {
        getAllNestedFolders(f, folders);
      }
    });

  return folders;
};
