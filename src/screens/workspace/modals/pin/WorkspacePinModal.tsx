import BottomModal from "@/ui/modals/BottomModal";
import Tappable from "@/ui/Tappable";
import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GridFlowNode } from "../../../../features/grid-flow/GridFlowInterface";
import WorkspacePinModalBlocks from "./WorkspacePinModalBlocks";
import WorkspacePinModalChats from "./WorkspacePinModalChats";
import {
  useWorkspaceModalsActions,
  useWorkspaceModalsStore,
} from "../../.store/WorkspaceModals.store";

function WorkspacePinModal(props: {
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;

  const { setShowPinModal } = useWorkspaceModalsActions();
  const showPinModal = useWorkspaceModalsStore((s) => s.showPinModal);

  const [tab, setTab] = useState<"chats" | "blocks">("chats");

  return (
    <BottomModal
      id="workspace-add-modal"
      isOpen={showPinModal}
      onClose={() => setShowPinModal(false)}
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
              <WorkspacePinModalChats nodes={nodes} setNodes={setNodes} />
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
              <WorkspacePinModalBlocks nodes={nodes} setNodes={setNodes} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomModal>
  );
}

export default memo(WorkspacePinModal);
