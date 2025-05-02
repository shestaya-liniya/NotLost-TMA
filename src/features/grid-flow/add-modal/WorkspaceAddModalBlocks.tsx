import Tappable from "@/ui/Tappable";
import { memo } from "react";
import { v4 } from "uuid";
import { GridFlowNode } from "../GridFlowInterface";
import { findFreeSpace } from "../GridFlowUtils";
import DuckIcon from "@/assets/icons/duck-rubber.svg?react";

function WorkspaceAddModalBlocks(props: {
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;

  return (
    <div className="min-h-72">
      <Tappable
        onTap={() => {
          const freeSpace = findFreeSpace(nodes, 2, 4);
          if (freeSpace) {
            const newNodeId = v4();
            const newNode: GridFlowNode = {
              id: newNodeId,
              type: "folder",
              data: {
                username: "shestaya_liniya",
                name: "Andrei",
              },
              position: freeSpace,
              className: "animate-fadeIn",
            };
            setNodes((nds) => nds.concat(newNode as GridFlowNode));

            setTimeout(() => {
              setNodes((ns) =>
                ns.map((n) => {
                  if (n.id === newNodeId) {
                    return { ...n, className: "" };
                  }
                  return n;
                })
              );
            }, 300);
          }
        }}
        className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative overflow-hidden border-[1px] border-secondary"
      >
        <div className="text-xs font-medium mt-2 w-full absolute top-0 left-0 pb-1.5 px-4 text-white flex items-center gap-1">
          <div className="tracking-widest text-[10px] text-[#d4d4d4]">
            Folder
          </div>
        </div>
        <div className="flex relative mt-8 gap-1">
          <div className="h-8 w-8 rounded-full bg-secondary relative">
            <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
          </div>
          <div className="h-8 w-8 rounded-full bg-secondary relative">
            <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
          </div>
          <div className="h-8 w-8 rounded-full bg-secondary relative">
            <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
          </div>
        </div>
      </Tappable>
    </div>
  );
}

export default memo(WorkspaceAddModalBlocks);
