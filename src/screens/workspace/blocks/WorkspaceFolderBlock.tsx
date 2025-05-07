import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import FolderIcon from "@/assets/icons/folder.svg?react";
import CrossIcon from "@/assets/icons/remove.svg?react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import Tappable from "@/ui/Tappable";
import { memo, useState } from "react";
import { createPortal } from "react-dom";

import { SwiperSlider } from "@/ui/dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";
import {
  GridFlowNode,
  GridFlowNodeTypes,
} from "@/features/grid-flow/GridFlowInterface";
import { gridFlowDeleteNode } from "@/features/grid-flow/GridFlowUtils";
import { AnimatePresence, motion } from "framer-motion";
import MoreIcon from "@/assets/icons/more.svg?react";
import TooltipModal, { TooltipItem } from "@/ui/modals/TooltipModal";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import MoveIcon from "@/assets/icons/cursor-grab.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { truncateWord } from "@/helpers/truncateWord";
import TelegramAvatar from "@/ui/TelegramAvatar";

export default function WorkspaceFolderBlock(props: {
  id: string;
  data: GridFlowNode["data"];
}) {
  const { id: nodeId, data } = props;
  const reactFlow = useReactFlow();
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const isDeleting = data.status === "deleting";
  const onDelete = () => {
    gridFlowDeleteNode(
      nodeId,
      reactFlow.setNodes as React.Dispatch<React.SetStateAction<GridFlowNode[]>>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <OpenedFolder
        isFolderOpen={isFolderOpen}
        closeFolder={() => setIsFolderOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          onClick={() => setIsFolderOpen(true)}
          className={`${isDeleting && "transition-all ease duration-300 scale-20 animate-fadeOutHidden"}`}
        >
          <div className="w-38 h-18 bg-secondary rounded-xl flex flex-col items-center relative border-[1px] border-secondary">
            <div className="flex w-full p-1 gap-2 items-center">
              <div className="p-1 bg-primary rounded-sm">
                <FolderIcon className="min-w-4 h-4 text-[#d4d4d4]" />
              </div>
              <div className="tracking-[0.5px] text-[10px] text-white w-full">
                Folder
              </div>
              <div className="text-[10px] text-hint pr-1">9</div>
            </div>

            <div className="flex relative self-start pl-2 gap-1">
              <img
                src={getTelegramAvatarLink("shestaya_liniya")}
                className="h-8 w-8 rounded-full"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
                }}
              />
              <img
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
                }}
                src={getTelegramAvatarLink("kopolinaa")}
                className="h-8 w-8 rounded-full"
              />
              <img
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
                }}
                src={getTelegramAvatarLink("devs_cis")}
                className="h-8 w-8 rounded-full"
              />
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
  isFolderOpen: boolean;
  closeFolder: () => void;
}) => {
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

  return createPortal(
    <AnimatePresence mode="wait">
      {props.isFolderOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-0 left-0 w-screen h-screen backdrop-blur-[2px]"
          onClick={props.closeFolder}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-1/2 pb-2 backdrop-blur-md rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 relative flex justify-center">
              <span className="tracking-[0.5px] text-lg text-center relative">
                Folder
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
              <SwiperSlider>
                <SwiperSlide>
                  <div className="w-[280px] h-[280px]">
                    <div className="grid grid-cols-3 gap-2 place-items-center pt-6 p-2">
                      <div>
                        <TelegramAvatar
                          username="shestaya_liniya"
                          className="h-14 w-14"
                        />
                        <div className="text-[8.5px] tracking-[0.5px] text-center mt-0.5 text-nowrap font-medium text-[#D6CFCB]">
                          {"Hellohellohello".length > 12 ? (
                            <div className="relative">
                              {truncateWord("Hellohellohello", 12)}
                              <div className="bg-gradient-to-r from-transparent to-secondary h-full w-8 absolute right-0 top-0"></div>
                            </div>
                          ) : (
                            "Hellohellohello"
                          )}
                        </div>
                      </div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                      <div className="h-18 w-full bg-red-500"></div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <PreviewGridFlow
                    nodes={[
                      {
                        id: "2",
                        type: "chat",
                        data: {
                          label: "Andrei",
                          username: "shestaya_liniya",
                        },
                        position: {
                          x: 20,
                          y: 20,
                        },
                      },
                    ]}
                    className="d"
                    id="erferf"
                  />
                </SwiperSlide>
                <div className="h-4"></div>
              </SwiperSlider>
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
                action={() => {}}
                closeTooltip={() => setShowTooltip(false)}
              ></TooltipItem>
              <TooltipItem
                title={<div>Move</div>}
                Icon={<MoveIcon className="h-5 w-5" />}
                action={() => {}}
                closeTooltip={() => setShowTooltip(false)}
              ></TooltipItem>
              <TooltipItem
                title={<div>Add</div>}
                Icon={<PlusIcon className="h-5 w-5" />}
                action={() => {}}
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
const PreviewGridFlow = memo(
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
);
