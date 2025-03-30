import { JazzFolder } from "@/lib/jazz/schema";
import { memo, useEffect, useState } from "react";
import FolderAccordion from "./FolderAccordion-refactor.tsx";
import { SwiperSlide } from "swiper/react";
import { SwiperSlider } from "../dialog/DialogsSlider";
import DialogWithActions from "../dialog/DialogWithActions";
import { chunkArray } from "@/helpers/chunkArray";
import { v4 as uuid } from "uuid";
import {
  jazzAddNestedFolderToFolder,
  jazzDeleteFolder,
} from "@/lib/jazz/actions/jazz-folder.ts";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider.tsx";
import InlineButton from "../InlineButton.tsx";
import { useModalStore } from "@/lib/store/modal-store.tsx";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PeopleIcon from "@/assets/icons/people.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";

function Folder(props: {
  folder: JazzFolder;
  nested?: boolean;
  setAsMainFolder?: () => void;
}) {
  const { jazzProfile } = useJazzProfileContext();
  const { setAddDialogModalOpen, setAddDialogModalFolder } = useModalStore();

  const [mainFolder, setMainFolder] = useState(props.folder);
  const [foldersStack, setFoldersStack] = useState([props.folder]);

  const prevFolder = foldersStack[foldersStack.length - 2];

  const handleAddNestedFolder = () => {
    jazzAddNestedFolderToFolder(jazzProfile, mainFolder, "New folder");
  };

  useEffect(() => {
    console.log(prevFolder && prevFolder.title);
  }, [foldersStack]);

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
        {mainFolder.nestedFolders?.map((nestedFolder) => {
          if (!nestedFolder) return null;
          return (
            <div key={nestedFolder.id} className="-ml-4 -mr-4">
              <NestedFolderAccordion
                folder={nestedFolder}
                handleSetAsMainFolder={() => {
                  setFoldersStack((prev) => [...prev, nestedFolder]);
                  setMainFolder(nestedFolder);
                }}
              />
            </div>
          );
        })}

        {mainFolder.dialogs.length > 9 ? (
          <div className="-ml-4 -mr-4">
            <SwiperSlider>
              {mainFolder.dialogs
                ? chunkArray(
                    mainFolder.dialogs.filter((d) => d !== null),
                    9
                  ).map((dialogGroup) => (
                    <SwiperSlide key={uuid()} className="h-full">
                      <div className="grid grid-cols-3 gap-2 h-full">
                        {dialogGroup.map((d, index) => {
                          return (
                            <DialogWithActions
                              key={d.id}
                              dialog={d}
                              folder={mainFolder}
                              index={index}
                            />
                          );
                        })}
                      </div>
                    </SwiperSlide>
                  ))
                : null}
            </SwiperSlider>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {mainFolder.dialogs
              .filter((d) => d !== null)
              .map((d, index) => {
                return (
                  <DialogWithActions
                    key={uuid()}
                    dialog={d}
                    folder={mainFolder}
                    index={index}
                  />
                );
              })}
          </div>
        )}

        {mainFolder.dialogs?.length === 0 && (
          <div className="text-hint text-center py-4 font-semibold">
            Nothing yet
          </div>
        )}

        <div className="flex gap-2 justify-between items-center">
          <InlineButton
            title=""
            onClick={() => {
              setAddDialogModalOpen(true);
              setAddDialogModalFolder(mainFolder);
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
              if (props.nested && props.setAsMainFolder) {
                props.setAsMainFolder();
              }
              handleAddNestedFolder();
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
  );
}

function NestedFolderAccordion(props: {
  folder: JazzFolder;
  handleSetAsMainFolder: () => void;
}) {
  const { jazzProfile } = useJazzProfileContext();
  const { setAddDialogModalOpen, setAddDialogModalFolder } = useModalStore();

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
        deleteFolder={() => jazzDeleteFolder(jazzProfile, props.folder)}
        setAsMainFolder={() => {
          props.handleSetAsMainFolder?.();
        }}
        shouldSetAsMainFolder={hasNestedFolders}
      >
        {props.folder.dialogs.length > 9 ? (
          <div className="-ml-4 -mr-4">
            <SwiperSlider>
              {props.folder.dialogs
                ? chunkArray(
                    props.folder.dialogs.filter((d) => d !== null),
                    9
                  ).map((dialogGroup) => (
                    <SwiperSlide key={uuid()} className="h-full">
                      <div className="grid grid-cols-3 gap-2 h-full">
                        {dialogGroup.map((d, index) => {
                          return (
                            <DialogWithActions
                              key={d.id}
                              dialog={d}
                              folder={props.folder}
                              index={index}
                            />
                          );
                        })}
                      </div>
                    </SwiperSlide>
                  ))
                : null}
            </SwiperSlider>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {props.folder.dialogs
              .filter((d) => d !== null)
              .map((d, index) => {
                return (
                  <DialogWithActions
                    key={uuid()}
                    dialog={d}
                    folder={props.folder}
                    index={index}
                  />
                );
              })}
          </div>
        )}

        {props.folder.dialogs?.length === 0 && (
          <div className="text-hint text-center py-4 font-semibold">
            Nothing yet
          </div>
        )}

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
              props.handleSetAsMainFolder();
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
  );
}

export default memo(Folder);
