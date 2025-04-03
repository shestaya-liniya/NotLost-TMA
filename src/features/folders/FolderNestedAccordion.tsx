import {
  jazzDeleteFolder,
  jazzAddNestedFolderToFolder,
} from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzFolder } from "@/lib/jazz/schema";
import FolderFooter from "./FolderFooter";
import FolderAccordion from "./FolderAccordion";
import FolderDialogGridOrSlider from "./FolderDialogGridOrSlider";

export default function FolderNestedAccordion(props: {
  parentFolder: JazzFolder;
  folder: JazzFolder;
  handleSetAsMainFolder: () => void;
}) {
  const { jazzProfile } = useJazzProfileContext();

  const hasNestedFolders =
    props.folder.nestedFolders && props.folder.nestedFolders.length > 0;

  if (!props.folder.dialogs) return;
  return (
    <div className="m-4">
      <FolderAccordion
        title={props.folder.title}
        previewUsersAvatars={props.folder.dialogs
          .slice(0, 3)
          .map((d) => ({ username: d?.username as string }))}
        saveTitle={(val) => (props.folder.title = val)}
        deleteFolder={() => {
          jazzDeleteFolder(jazzProfile, props.parentFolder, props.folder);
        }}
        setAsMainFolder={() => {
          props.handleSetAsMainFolder?.();
        }}
        shouldSetAsMainFolder={hasNestedFolders}
      >
        <FolderDialogGridOrSlider folder={props.folder} />

        <FolderFooter
          folder={props.folder}
          shouldSetAsMainFolder={true}
          handleSetAsMainFolder={props.handleSetAsMainFolder}
          handleAddNestedFolder={() => {
            jazzAddNestedFolderToFolder(jazzProfile, props.folder);
          }}
        />
      </FolderAccordion>
    </div>
  );
}
