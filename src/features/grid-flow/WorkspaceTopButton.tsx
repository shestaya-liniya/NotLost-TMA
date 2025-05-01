import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { useWorkspaceStore } from "./WorkspaceStore";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import PinIcon from "@/assets/icons/pin.svg?react";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";

const WorkspaceTopButton = (props: { menuShown: boolean }) => {
  const { nodesDraggable, deleteModeEnabled } = useWorkspaceStore();

  const topButtonActive = nodesDraggable || deleteModeEnabled;

  return (
    <AnimatePresence>
      {nodesDraggable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-1">
            <div>Done</div>
            <GrabIcon className="w-6 h-6" />
          </div>
        </motion.div>
      )}
      {deleteModeEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-1">
            <div>Done</div>
            <div className="relative">
              <PinIcon className="w-4 h-4 ml-2 relative right-1" />
              <div className="absolute -top-[7px] left-[9px] -rotate-60 text-lg font-light">
                /
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {!topButtonActive && (
        <motion.div>
          <div className="flex items-center gap-2">
            Workspace
            <SettingsIcon
              className={`h-4 w-4 text-white transition-transform duration-300 ${
                props.menuShown ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(WorkspaceTopButton);
