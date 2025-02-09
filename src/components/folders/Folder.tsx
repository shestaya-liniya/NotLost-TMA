import { jazzDeleteFolder } from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzFolder } from "@/lib/jazz/schema";
import { useDragStore } from "@/lib/zustand-store/drag-store";
import Accordion from "@/ui/Accordion";
import DragSensible from "@/ui/DragSensible";
import InlineButton from "@/ui/InlineButton";
import { useState, useRef, useEffect, memo } from "react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";

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
  const [editingTitle, setEditingTitle] = useState(false);
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
        <div className="px-4 py-2 relative">
          <Accordion
            title={folder.title}
            expanded={expanded}
            setExpanded={setExpanded}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            onBlur={(title: string) => (folder.title = title)}
          >
            <div className="flex gap-2 justify-center">
              <InlineButton
                title="Edit"
                onClick={() => setEditingTitle(true)}
                Icon={<PencilIcon className="w-4 h-4" />}
              />
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

export default memo(Folder);
