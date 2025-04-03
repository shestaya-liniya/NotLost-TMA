import { JazzFolder } from "@/lib/jazz/schema";
import { memo, useState } from "react";
import FolderAccordion from "./FolderAccordion.tsx";
import {
  jazzAddNestedFolderToFolder,
  jazzDeleteFolder,
} from "@/lib/jazz/actions/jazz-folder.ts";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider.tsx";
import FolderFooter from "./FolderFooter.tsx";
import FolderDialogGridOrSlider from "./FolderDialogGridOrSlider.tsx";
import FolderNestedAccordion from "./FolderNestedAccordion.tsx";

function Folder(props: { folder: JazzFolder }) {
  const { jazzProfile } = useJazzProfileContext();

  const [mainFolder, setMainFolder] = useState(props.folder);
  const [foldersStack, setFoldersStack] = useState([props.folder]);

  const prevFolder = foldersStack[foldersStack.length - 2];

  if (!mainFolder.dialogs) return;
  return (
    <div className="px-4 py-2">
      <FolderAccordion
        title={mainFolder.title}
        prevFolder={prevFolder}
        returnToPrevFolder={() => {
          if (prevFolder) {
            setMainFolder(prevFolder);
            setFoldersStack(foldersStack.slice(0, -1));
          }
        }}
        previewUsersAvatars={mainFolder.dialogs
          .slice(0, 3)
          .map((d) => ({ username: d?.username as string }))}
        saveTitle={(val) => (mainFolder.title = val)}
        deleteFolder={() => jazzDeleteFolder(jazzProfile, mainFolder)}
      >
        {mainFolder.nestedFolders
          ?.filter((f) => f !== null)
          .map((nestedFolder) => {
            return (
              <div key={nestedFolder.id} className="-ml-4 -mr-4">
                <FolderNestedAccordion
                  parentFolder={mainFolder}
                  folder={nestedFolder}
                  handleSetAsMainFolder={() => {
                    setFoldersStack((prev) => [...prev, nestedFolder]);
                    setMainFolder(nestedFolder);
                  }}
                />
              </div>
            );
          })}

        <FolderDialogGridOrSlider folder={mainFolder} />

        <FolderFooter
          folder={mainFolder}
          shouldSetAsMainFolder={false}
          handleAddNestedFolder={() =>
            jazzAddNestedFolderToFolder(jazzProfile, mainFolder)
          }
        />
      </FolderAccordion>
    </div>
  );
}

export default memo(Folder);
