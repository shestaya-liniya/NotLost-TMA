import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import FolderIcon from "@/assets/icons/folder.svg?react";
import CrossIcon from "@/assets/icons/remove.svg?react";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import Tappable from "@/ui/Tappable";
import { GridFlowNode } from "../GridFlowInterface";
import { gridFlowDeleteNode } from "../GridFlowUtils";
import { memo, useState } from "react";
import { createPortal } from "react-dom";

import { initNodes, GridFlowNodeTypes } from "./GridFlowNodes";
import { SwiperSlider } from "@/ui/dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";

export default function GridFlowFolderNode(props: {
  id: string;
  data: GridFlowNode["data"];
}) {
  const { id: nodeId, data } = props;
  const reactFlow = useReactFlow();

  const isDeleting = data.status === "deleting";
  const onDelete = () => {
    gridFlowDeleteNode(
      nodeId,
      reactFlow.setNodes as React.Dispatch<React.SetStateAction<GridFlowNode[]>>
    );
  };

  const [open, setOpen] = useState(false);

  if (open) {
    return createPortal(
      <div
        className="absolute top-0 left-0 w-screen h-screen backdrop-blur-[2px]"
        onPointerDown={() => setOpen(false)}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-1/2 pb-2 w-[280px] bg-secondary rounded-3xl overflow-hidden shadow-xl"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="text-center">Button</div>
          <SwiperSlider>
            <SwiperSlide>
              <PreviewGridFlow className="d" id="gdfv" />
            </SwiperSlide>
            <SwiperSlide>
              <PreviewGridFlow className="d" id="erferf" />
            </SwiperSlide>
            <div className="h-4"></div>
          </SwiperSlider>
        </div>
      </div>,
      document.body
    );
  }
  return (
    <Tappable
      /* onClick={() => setOpen(true)} */
      className={`${isDeleting && "transition-all ease duration-300 scale-20 animate-fadeOutHidden"}`}
    >
      <div className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative border-[1px] border-secondary">
        <div className="text-xs font-medium mt-2 w-full pb-1.5 px-4 text-white flex items-center gap-1">
          <FolderIcon className="w-4 h-4 text-hint" />
          <div className="tracking-[1px] text-[10px] text-[#d4d4d4]">
            Folder
          </div>
        </div>
        <div className="flex items-center left-3 relative">
          <img
            src={getTelegramAvatarLink("shestaya_liniya")}
            className="h-8 w-8 rounded-full"
          />
          <img
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
            }}
            src={getTelegramAvatarLink("kopolinaa")}
            className="h-8 w-8 rounded-full relative -left-2"
          />
          <img
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
            }}
            src={getTelegramAvatarLink("devs_cis")}
            className="h-8 w-8 rounded-full relative -left-4"
          />
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
            }}
            className="h-8 w-8 bg-secondary rounded-full relative -left-6 grid place-content-center"
          >
            <div className="text-hint text-[10px]">+9</div>
          </div>
        </div>

        {/* <div className="absolute top-1 right-1 bg-red-500 rounded-full text-xs h-3 w-3 text-[9px] grid place-items-center">
        4
      </div> */}

        {data.deleteMode && (
          <Tappable
            onTap={onDelete}
            className="absolute -top-2 -right-1 bg-secondary p-1 rounded-full scale-80"
          >
            <CrossIcon className="h-4 w-4" />
          </Tappable>
        )}
      </div>
    </Tappable>
  );
}

// eslint-disable-next-line react/display-name
const PreviewGridFlow = memo(
  ({ className, id }: { className?: string; id: string }) => {
    return (
      <ReactFlowProvider>
        <div style={{ width: "260px", height: "260px" }} className={className}>
          <ReactFlow
            id={id}
            nodes={initNodes}
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
