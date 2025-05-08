import Tappable from "@/ui/Tappable";
import { memo } from "react";
import { GridFlowNode } from "@/features/grid-flow/GridFlowInterface";
import { gridFlowAddNode } from "@/features/grid-flow/GridFlowUtils";
import FolderIcon from "@/assets/icons/folder.svg?react";

function WorkspacePinModalBlocks(props: {
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;
  const folders = nodes.filter(
    (n) =>
      n.type === "folder" && n.data.title && n.data.title.includes("Folder")
  );
  return (
    <div className="min-h-72">
      <Tappable
        onTap={() => {
          gridFlowAddNode(
            {
              type: "folder",
              data: {
                title: folders?.length
                  ? `Folder (${(folders?.length ?? 0) + 1})`
                  : "Folder",
              },
            },
            nodes,
            setNodes
          );
        }}
        className="h-18 bg-secondary rounded-xl flex items-center justify-center gap-2 relative overflow-hidden border-[1px] border-secondary"
      >
        <div className="relative">
          <FolderIcon className="w-8 h-8 text-hint" />
        </div>
        <div className="text-hint font-semibold flex gap-1">
          <div>New Folder</div>
        </div>
      </Tappable>
    </div>
  );
}

export default memo(WorkspacePinModalBlocks);
