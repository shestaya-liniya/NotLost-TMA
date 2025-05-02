import BottomModal from "@/ui/modals/BottomModal";
import Tappable from "@/ui/Tappable";
import { GridFlowNode } from "../GridFlowInterface";
import { memo, useState } from "react";
import WorkspaceAddModalChats from "./WorkspaceAddModalChats";
import WorkspaceAddModalBlocks from "./WorkspaceAddModalBlocks";
import { AnimatePresence, motion } from "framer-motion";

function WorkspaceAddModal(props: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;

  const [tab, setTab] = useState<"chats" | "blocks">("chats");

  if (!props.showModal) return;

  return (
    <BottomModal
      id="workspace-add-modal"
      isOpen={props.showModal}
      onClose={() => props.setShowModal(false)}
      title="New"
    >
      <div>
        <div className="flex gap-2 text-hint text-sm mb-4 ml-2">
          <Tappable
            onTap={() => setTab("chats")}
            className={`px-2 py-1 border-[1px] border-secondary rounded-lg ${tab === "chats" && "bg-white text-black "}`}
          >
            Chats
          </Tappable>

          <Tappable
            className={`px-2 py-1 border-[1px] border-secondary rounded-lg ${tab === "blocks" && "bg-white text-black "}`}
            onTap={() => setTab("blocks")}
          >
            Blocks
          </Tappable>
        </div>
        <AnimatePresence mode="wait">
          {tab === "chats" && (
            <motion.div
              key="chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WorkspaceAddModalChats nodes={nodes} setNodes={setNodes} />
            </motion.div>
          )}

          {tab === "blocks" && (
            <motion.div
              key="blocks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <WorkspaceAddModalBlocks nodes={nodes} setNodes={setNodes} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomModal>
  );
}

export default memo(WorkspaceAddModal);
