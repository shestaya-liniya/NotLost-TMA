import {
  jazzAddDialogToFolder,
  jazzDeleteFolder,
} from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzFolder } from "@/lib/jazz/schema";
import { useDragStore } from "@/lib/store/drag-store";
import Accordion from "@/ui/Accordion";
import DragSensible from "@/ui/DragSensible";
import InlineButton from "@/ui/InlineButton";
import { useState, useRef, useEffect, memo } from "react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import Dialog from "@/ui/Dialog";

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
  const { draggableItem } = useDragStore();
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
        sensibleFor="contact"
        onDragEnd={() => {
          if (draggableItem) {
            jazzAddDialogToFolder(jazzProfile, folder, draggableItem);
          }
        }}
      >
        <div className="px-4 py-2 relative">
          <Accordion
            title={folder.title}
            expanded={expanded}
            setExpanded={setExpanded}
            editingTitle={editingTitle}
            onBlur={(title: string) => {
              folder.title = title;
              setEditingTitle(false);
            }}
          >
            <div className="flex flex-col gap-2 justify-center">
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
              <div className="flex justify-center gap-2 flex-wrap">
                {folder.dialogs?.map((dialog) => {
                  if (!dialog) return null;
                  return (
                    <div key={dialog.id} className="animate-fadeIn">
                      <Dialog name={dialog.name} username={dialog.username} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Accordion>
        </div>
      </DragSensible>
    </div>
  );
}

export default memo(Folder);
