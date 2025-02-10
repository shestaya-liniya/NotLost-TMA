import {
  jazzAddDialogToFolder,
  jazzAddNestedFolderToFolder,
  jazzDeleteFolder,
} from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzFolder } from "@/lib/jazz/schema";
import { useDragStore } from "@/lib/store/drag-store";
import FolderAccordion from "@/ui/FolderAccordion";
import DragSensible from "@/ui/DragSensible";
import InlineButton from "@/ui/InlineButton";
import { useState, useRef, useEffect, memo } from "react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Dialog from "@/ui/Dialog";
import Tappable from "@/ui/Tappable";

function Folder(props: {
  folder: JazzFolder;
  setFolderHeight: (height: number) => void;
  onDeleteFolder: () => void;
}) {
  const mainFolder = props.folder;

  const { jazzProfile } = useJazzProfileContext();
  const { draggableItem } = useDragStore();

  const [foldersTitleStack, setFoldersTitleStack] = useState(mainFolder.title);
  const [activeFolderStack, setActiveFolderStack] = useState<JazzFolder[]>([
    mainFolder,
  ]);

  const activeFolder = activeFolderStack[activeFolderStack.length - 1];
  const prevActiveFolder = activeFolderStack[activeFolderStack.length - 2];

  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [hidden, setHidden] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      props.setFolderHeight(ref.current.clientHeight);
    }
  }, [expanded, mainFolder]);

  const handleRemoveFolder = () => {
    if (activeFolderStack.length === 1) {
      // Animation on main folder
      setHidden(true);
      setTimeout(() => {
        jazzDeleteFolder(jazzProfile, activeFolder);
        props.onDeleteFolder();
      }, 300);
    } else {
      setActiveFolderStack(activeFolderStack.slice(0, -1));
      setFoldersTitleStack(
        activeFolderStack
          .slice(0, -1)
          .map((folder) => folder.title)
          .join(" / ")
      );
      jazzDeleteFolder(jazzProfile, prevActiveFolder, activeFolder);
    }
  };

  const handleAddNestedFolder = () => {
    jazzAddNestedFolderToFolder(jazzProfile, activeFolder, "New folder");
  };

  const updateFoldersStack = (folder: JazzFolder) => {
    setFoldersTitleStack((prev) => `${prev} / ${folder.title}`);
    setActiveFolderStack((prev) => [...prev, folder]);
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
            jazzAddDialogToFolder(jazzProfile, activeFolder, draggableItem);
          }
        }}
      >
        <div className="px-4 py-2 relative">
          <FolderAccordion
            title={foldersTitleStack}
            foldersStack={activeFolderStack}
            expanded={expanded}
            setExpanded={setExpanded}
            editingTitle={editingTitle}
            onBlur={(title: string) => {
              activeFolder.title = title;
              setEditingTitle(false);
            }}
          >
            <div className="flex flex-col gap-2 justify-center">
              <div className="flex gap-2 justify-center items-center">
                <InlineButton
                  title="Edit"
                  onClick={() => setEditingTitle(true)}
                  Icon={<PencilIcon className="w-4 h-4" />}
                />
                <InlineButton
                  title="Folder"
                  onClick={handleAddNestedFolder}
                  Icon={<FolderIcon className="w-4 h-4" />}
                />
                <InlineButton
                  title="Remove"
                  onClick={handleRemoveFolder}
                  Icon={<RemoveIcon className="w-4 h-4" />}
                />
              </div>
              {activeFolderStack.length > 1 && (
                <div
                  className="w-full py-2 rounded-xl text-center bg-link/10 text-link animate-fadeIn"
                  onClick={() => {
                    setActiveFolderStack(activeFolderStack.slice(0, -1));
                    setFoldersTitleStack(
                      activeFolderStack
                        .slice(0, -1)
                        .map((folder) => folder.title)
                        .join(" / ")
                    );
                  }}
                >
                  Return to{" "}
                  {activeFolderStack[activeFolderStack.length - 2].title}
                </div>
              )}
              <div className="flex justify-center gap-2 flex-wrap">
                {activeFolder.nestedFolders?.map((nestedFolder) => {
                  if (!nestedFolder) return null;
                  return (
                    <NestedFolder
                      key={nestedFolder.id}
                      title={nestedFolder.title}
                      updateFoldersStack={() =>
                        updateFoldersStack(nestedFolder)
                      }
                    />
                  );
                })}
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {activeFolder.dialogs?.map((dialog) => {
                  if (!dialog) return null;
                  return (
                    <div key={dialog.id} className="animate-fadeIn">
                      <Dialog name={dialog.name} username={dialog.username} />
                    </div>
                  );
                })}
              </div>
            </div>
          </FolderAccordion>
        </div>
      </DragSensible>
    </div>
  );
}

function NestedFolder({
  updateFoldersStack,
  title,
}: {
  updateFoldersStack: () => void;
  title: string;
}) {
  return (
    <Tappable
      className={` rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn bg-link/20 text-link`}
      onClick={updateFoldersStack}
    >
      <FolderIcon className="w-4 h-4" />
      <span className="text-sm font-medium">{title}</span>
    </Tappable>
  );
}

export default memo(Folder);
