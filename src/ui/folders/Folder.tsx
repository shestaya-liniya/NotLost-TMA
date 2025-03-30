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
import FolderIcon from "@/assets/icons/folder.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PeopleIcon from "@/assets/icons/people.svg?react";

import { updateLocalStorage } from "@/helpers/use-localstorage-listener";
import { useModalStore } from "@/lib/store/modal-store";
import { SwiperSlider } from "../dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";
import DialogWithActions from "../dialog/DialogWithActions";

import { v4 as uuidv4 } from "uuid";

function Folder(props: {
  folder: JazzFolder;
  nested?: boolean;
  setAsParentFolder?: () => void;
}) {
  const { jazzProfile } = useJazzProfileContext();
  const { draggableItem } = useDragStore();
  const { setAddDialogModalOpen, setAddDialogModalFolder } = useModalStore();

  const [foldersTitleStack, setFoldersTitleStack] = useState(
    props.folder.title
  );
  const [activeFolderStack, setActiveFolderStack] = useState<JazzFolder[]>([
    props.folder,
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
  }, [expanded, props.folder, activeFolder, ref.current?.clientHeight]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      setTimeout(() => {
        if (ref.current) {
          props.setFolderHeight(ref.current.clientHeight);
        }
      }, 300);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

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
    setFoldersTitleStack((prev) => `${prev} / hello`);
    setActiveFolderStack((prev) => [...prev, folder]);
  };

  return (
    <div
      ref={ref}
      className={
        hidden
          ? "transition-all duration-300 ease-in-out opacity-0 -z-10"
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
            setExpanded={(expanded: boolean) => {
              if (
                props.nested &&
                props.setAsParentFolder &&
                props.folder.nestedFolders &&
                props.folder.nestedFolders.length > 0
              ) {
                props.setAsParentFolder();
              }
              setExpanded(expanded);
            }}
            editingTitle={editingTitle}
            onBlur={(title: string) => {
              if (/\p{L}/u.test(title)) {
                activeFolder.title = title;
              } else {
                props.folder.title = "New Folder";
              }
              updateLocalStorage(
                "folders",
                JSON.stringify(jazzProfile.folders)
              );

              setEditingTitle(false);
            }}
            returnToParentFolder={() => {
              setActiveFolderStack(activeFolderStack.slice(0, -1));
              setFoldersTitleStack(
                activeFolderStack
                  .slice(0, -1)
                  .map((folder) => folder.title)
                  .join(" / ")
              );
            }}
            handleEditFolder={() => {
              setEditingTitle(true);
            }}
            handleDeleteFolder={() => {
              handleRemoveFolder();
            }}
            dialogsTrio={
              props.folder.dialogs
                ? props.folder.dialogs
                    .slice(0, 3)
                    .map((d) => ({ username: d?.username as string }))
                : []
            }
          >
            <div className="flex flex-col gap-2 justify-center">
              {/* <div className="flex justify-center gap-2 flex-wrap">
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
              </div> */}

              {activeFolder.nestedFolders?.map((nestedFolder) => {
                if (!nestedFolder) return null;
                return (
                  <div key={nestedFolder.id} className="-ml-4 -mr-4">
                    <Folder
                      nested={true}
                      setAsParentFolder={() => updateFoldersStack(nestedFolder)}
                      folder={nestedFolder}
                      setFolderHeight={() => {}}
                      onDeleteFolder={() => {
                        jazzDeleteFolder(
                          jazzProfile,
                          activeFolder,
                          nestedFolder
                        );
                        setActiveFolderStack(
                          activeFolderStack.filter(
                            (f) => f.id !== nestedFolder.id
                          )
                        );
                      }}
                    />
                  </div>
                );
              })}
              {activeFolder.dialogs && activeFolder.dialogs.length > 0 ? (
                activeFolder.dialogs.length > 9 ? (
                  <div className="-ml-4 -mr-4">
                    <SwiperSlider>
                      {activeFolder.dialogs
                        ? chunkArray(activeFolder.dialogs, 9).map(
                            (dialogGroup) => (
                              <SwiperSlide key={uuidv4()}>
                                <div className="grid grid-cols-3 gap-2">
                                  {dialogGroup.map((d, index) => {
                                    if (!d) return <></>;
                                    return (
                                      <DialogWithActions
                                        key={d.id}
                                        dialog={d}
                                        folder={activeFolder}
                                        index={index}
                                      />
                                    );
                                  })}
                                </div>
                              </SwiperSlide>
                            )
                          )
                        : null}
                    </SwiperSlider>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {activeFolder.dialogs.map((d, index) => {
                      if (!d) return <></>;

                      return (
                        <DialogWithActions
                          key={`dialog-${d.id}-${index}`}
                          dialog={d}
                          folder={activeFolder}
                          index={index}
                        />
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="text-hint text-center py-4 font-semibold">
                  Nothing yet
                </div>
              )}
            </div>
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
              {/* <InlineButton
                  title="Edit"
                  onClick={() => setEditingTitle(true)}
                  Icon={<PencilIcon className="w-5 h-5" />}
                /> */}
              <div className="w-32"></div>
              <InlineButton
                title=""
                onClick={() => {
                  if (props.nested && props.setAsParentFolder) {
                    props.setAsParentFolder();
                    handleAddNestedFolder();
                  } else {
                    handleAddNestedFolder();
                  }
                }}
                Icon={
                  <div className="flex gap-0.5 items-center">
                    <FolderIcon className="w-6 h-6" />
                    <PlusIcon className="w-5 h-5" />
                  </div>
                }
              />
            </div>
          </FolderAccordion>
        </div>
      </DragSensible>
    </div>
  );
}

export default memo(Folder);

function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((chunks: T[][], _, i) => {
    if (i % size === 0) chunks.push(array.slice(i, i + size));
    return chunks;
  }, []);
}
