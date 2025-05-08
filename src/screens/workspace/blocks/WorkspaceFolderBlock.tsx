import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import FolderIcon from "@/assets/icons/folder.svg?react";
import CrossIcon from "@/assets/icons/remove.svg?react";
import { useReactFlow } from "@xyflow/react";
import Tappable from "@/ui/Tappable";
import { useState } from "react";
import { createPortal } from "react-dom";

import { SwiperSlider } from "@/ui/dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";
import {
  GridFlowFolderNodeData,
  GridFlowNode,
} from "@/features/grid-flow/GridFlowInterface";
import { gridFlowDeleteNode } from "@/features/grid-flow/GridFlowUtils";
import { AnimatePresence, motion } from "framer-motion";
import MoreIcon from "@/assets/icons/more.svg?react";
import TooltipModal, { TooltipItem } from "@/ui/modals/TooltipModal";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { truncateWord } from "@/helpers/truncateWord";
import TelegramAvatar from "@/ui/TelegramAvatar";
import { useWorkspaceModalsActions } from "../.store/WorkspaceModals.store";
import {
  useWorkspaceActions,
  useWorkspaceStore,
} from "../.store/Workspace.store";
import { chunkArray } from "@/helpers/chunkArray";
import { v4 } from "uuid";
import {
  JazzListOfWorkspaceFolderChats,
  JazzWorkspaceFolderChat,
} from "@/lib/jazz/schema";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import FolderAccordionTitle from "@/features/folders/FolderAccordionTitle";

export default function WorkspaceFolderBlock(props: {
  id: string;
  data: GridFlowFolderNodeData;
}) {
  const { id: nodeId, data } = props;
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const { setOpenedFolder } = useWorkspaceActions();
  const reactFlow = useReactFlow();
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const jazzFolder = activeWorkspace?.folders?.find(
    (f) => f?.data.title === data.title
  );

  const handleSetOpened = () => {
    if (jazzFolder) {
      setOpenedFolder(jazzFolder);
      setIsFolderOpen(true);
    }
  };

  const isDeleting = data.status === "deleting";
  const onDelete = () => {
    gridFlowDeleteNode(
      nodeId,
      reactFlow.setNodes as React.Dispatch<React.SetStateAction<GridFlowNode[]>>
    );
  };

  return (
    <AnimatePresence>
      <OpenedFolder
        id={nodeId}
        isFolderOpen={isFolderOpen}
        chats={jazzFolder?.chats as JazzWorkspaceFolderChat[]}
        closeFolder={() => setIsFolderOpen(false)}
      />
      <motion.div
        key={nodeId + "-folder"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onClick={() => {
            if (!data.deleteMode) {
              handleSetOpened();
            }
          }}
          className={`${isDeleting && "transition-all ease duration-300 scale-20 animate-fadeOutHidden"}`}
        >
          <div className="w-38 h-18 bg-secondary rounded-xl flex flex-col items-center relative border-[1px] border-secondary">
            <div className="flex w-full p-1 gap-1 items-center">
              <div className="p-1">
                <FolderIcon className="min-w-4 h-4 text-[#d4d4d4]" />
              </div>
              <div className="tracking-[0.5px] text-[10px] text-white w-full">
                {data.title}
              </div>
            </div>

            <div className="flex relative self-start pl-2 gap-1">
              {jazzFolder?.chats
                ?.slice(0, 3)
                .filter((c) => c !== null)
                .map((c) => (
                  <img
                    key={c.id}
                    style={{
                      boxShadow:
                        "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
                    }}
                    src={getTelegramAvatarLink(c.username)}
                    className="h-8 w-8 rounded-full"
                  />
                ))}
              {jazzFolder?.chats?.length === 0 && (
                <div className="text-xs text-hint">No chats</div>
              )}
            </div>
            {data.deleteMode && (
              <Tappable
                onTap={onDelete}
                className="absolute -top-2 -right-1 bg-secondary p-1 rounded-full scale-80"
              >
                <CrossIcon className="h-4 w-4" />
              </Tappable>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const OpenedFolder = (props: {
  id: string;
  isFolderOpen: boolean;
  closeFolder: () => void;
  chats: JazzWorkspaceFolderChat[];
}) => {
  const openedFolder = useWorkspaceStore((s) => s.openedFolder);
  const { setOpenedFolder } = useWorkspaceActions();

  const { setShowFolderPinModal } = useWorkspaceModalsActions();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPoisition, setTooltipPosition] = useState<null | {
    x: number;
    y: number;
  }>(null);

  const handleActionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.bottom + window.scrollY + 8,
      y: rect.right + window.scrollX,
    });
    setShowTooltip(true);
  };

  const [deleteMode, setDeleteMode] = useState(false);

  const removeFromFolder = (username: string) => {
    if (openedFolder && openedFolder.chats) {
      const filteredChats = openedFolder?.chats?.filter(
        (c) => c?.username !== username
      );
      openedFolder.chats = JazzListOfWorkspaceFolderChats.create(filteredChats);
      setOpenedFolder(openedFolder);
    }
  };

  const [titleEditable, setTitleEditable] = useState(false);

  return createPortal(
    <AnimatePresence>
      {props.isFolderOpen && (
        <motion.div
          key={props.id + "-folder-open"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-0 left-0 w-screen h-screen backdrop-blur-[5px]"
          onClick={props.closeFolder}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-1/2 pb-2 rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 relative flex justify-center ">
              <span className="tracking-[0.5px] text-lg text-center relative border-[1px] border-white rounded-2xl px-2">
                <div onPointerDown={() => setTitleEditable(true)}>
                  <FolderAccordionTitle
                    value={openedFolder?.data.title || ""}
                    onBlur={(val) => {
                      if (openedFolder) {
                        openedFolder.data.title = val;
                      }
                      setTitleEditable(false);
                    }}
                    isFocused={titleEditable}
                  />
                </div>

                {/* <div
                  contentEditable={deleteMode}
                  className="outline-none"
                  onChange={(e) => {
                    if (!openedFolder) return;
                    const text = (e.target as HTMLDivElement).innerText;
                    openedFolder.data.title = text;
                  }}
                >
                  {openedFolder?.data.title}
                </div> */}

                <div className="absolute -bottom-1.5 -left-8 -translate-y-1/2">
                  <FolderIcon className="h-5 w-5" />
                </div>
              </span>

              <div
                onClick={handleActionsClick}
                className={`absolute right-4 top-1/2 -translate-y-1/2   bg-secondary p-1 rounded-full `}
              >
                <MoreIcon
                  className={`h-4 w-4 transition-all duration-300 ease ${showTooltip ? "" : "rotate-90"}`}
                />
              </div>
            </div>
            <div className="w-[280px] h-[280px] bg-secondary/80 rounded-3xl">
              {openedFolder &&
                openedFolder.chats &&
                openedFolder?.chats?.length === 0 && (
                  <div className="h-full w-full grid place-content-center ">
                    <div
                      className="flex flex-col items-center"
                      onClick={() => {
                        setShowFolderPinModal(true);
                      }}
                    >
                      {/* <div className="bg-[#d4d4d4] rounded-full p-1">
                        <PlusIcon className="h-6 w-6 text-black" />
                      </div> */}
                      <div className="text-hint">+ Add first chat</div>
                    </div>
                  </div>
                )}
              {openedFolder && openedFolder.chats && (
                <SwiperSlider
                  key={openedFolder.chats
                    .filter((d) => d !== null)
                    .map((c) => c.id)
                    .join(",")}
                >
                  {chunkArray(
                    openedFolder.chats.filter((d) => d !== null),
                    9
                  ).map((chatsGroup) => (
                    <SwiperSlide key={v4()} className="h-full">
                      <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full place-items-center py-4 px-2 relative -top-2">
                        {chatsGroup.map((c) => (
                          <div
                            key={c.id}
                            className="flex flex-col items-center relative"
                            onClick={() => {
                              if (openTelegramLink.isAvailable()) {
                                openTelegramLink("https://t.me/" + c.username);
                              }
                            }}
                          >
                            <TelegramAvatar
                              username={c.username}
                              className="h-14 min-w-14"
                            />
                            <div className="text-[8.5px] tracking-[0.5px] text-center mt-0.5 text-nowrap font-medium text-[#D6CFCB]">
                              {c.label.length > 12 ? (
                                <div className="relative">
                                  {truncateWord(c.label, 12)}
                                  <div className="bg-gradient-to-r from-transparent to-secondary h-full w-8 absolute right-0 top-0"></div>
                                </div>
                              ) : (
                                c.label
                              )}
                            </div>
                            {deleteMode && (
                              <Tappable
                                onTap={() => {
                                  removeFromFolder(c.username);
                                }}
                                className="absolute right-0 bg-secondary p-1 rounded-full scale-80"
                              >
                                <CrossIcon className="h-4 w-4" />
                              </Tappable>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="h-8"></div>
                    </SwiperSlide>
                  ))}
                </SwiperSlider>
              )}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <TooltipModal
              isVisible={showTooltip}
              position={tooltipPoisition}
              handleClose={() => setShowTooltip(false)}
              side="left"
            >
              <TooltipItem
                title={<div>Edit</div>}
                Icon={<PencilIcon className="h-4 w-4" />}
                action={() => {
                  setDeleteMode(!deleteMode);
                }}
                closeTooltip={() => setShowTooltip(false)}
              ></TooltipItem>
              <TooltipItem
                title={<div>Add</div>}
                Icon={<PlusIcon className="h-5 w-5" />}
                action={() => {
                  setShowFolderPinModal(true);
                }}
                closeTooltip={() => setShowTooltip(false)}
              ></TooltipItem>
            </TooltipModal>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// eslint-disable-next-line react/display-name
/* const PreviewGridFlow = memo(
  ({
    className,
    id,
    nodes,
  }: {
    className?: string;
    id: string;
    nodes: GridFlowNode[];
  }) => {
    return (
      <ReactFlowProvider>
        <div style={{ width: "260px", height: "260px" }} className={className}>
          <ReactFlow
            id={id}
            nodes={nodes}
            nodeTypes={GridFlowNodeTypes}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
            nodesDraggable={false}
            panOnDrag={false}
            preventScrolling={true}
            proOptions={{ hideAttribution: true }}
          ></ReactFlow>
        </div>
      </ReactFlowProvider>
    );
  }
); */
