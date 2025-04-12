import { JazzFolder } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PeopleIcon from "@/assets/icons/people.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import InlineButton from "@/ui/InlineButton";

export default function FolderFooter(props: {
  folder: JazzFolder;
  shouldSetAsMainFolder: boolean;
  handleSetAsMainFolder?: () => void;
  handleAddNestedFolder: () => void;
}) {
  const { setAddDialogModalOpen, setAddDialogModalFolder } = useModalStore();

  return (
    <div className="flex gap-2 justify-between items-center">
      <InlineButton
        title=""
        onClick={() => {
          setAddDialogModalOpen(true);
          setAddDialogModalFolder(props.folder);
        }}
        Icon={
          <div className="flex gap-0.5 items-center">
            <PeopleIcon className="w-6 h-6" />
            <PlusIcon className="w-5 h-5" />
          </div>
        }
      />
      <div className="w-32"></div>
      <InlineButton
        title=""
        onClick={() => {
          if (props.shouldSetAsMainFolder) {
            props.handleSetAsMainFolder?.();
          }
          props.handleAddNestedFolder();
        }}
        Icon={
          <div className="flex gap-0.5 items-center">
            <FolderIcon className="w-6 h-6" />
            <PlusIcon className="w-5 h-5" />
          </div>
        }
      />
    </div>
  );
}
