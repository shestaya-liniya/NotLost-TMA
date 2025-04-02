import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { getMiniAppTopInset } from "@/helpers/css/get-top-tg-inset";
import Tappable from "@/ui/Tappable";
import { createPortal } from "react-dom";
import BottomModal from "@/ui/modals/BottomModal";
import Switch from "@/ui/Switch";
import { useGraphStore } from "../GraphContext";

export default function GraphSettings() {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    graphDragMode,
    setGraphDragMode,
    setGraphCooldownTicks,
    setGraphWarmupTicks,
    showFolderFlags,
    setShowFolderFlags,
  } = useGraphStore();
  return (
    <div>
      <Tappable
        onClick={() => setIsSettingsModalOpen(true)}
        className="bg-primary/50 absolute right-4 backdrop-blur-xl p-2 rounded-2xl z-50 mt-2"
        style={{
          top: getMiniAppTopInset(),
        }}
      >
        <SettingsIcon className="h-8 w-8 text-link  " />
      </Tappable>
      {createPortal(
        <BottomModal
          id=""
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          title="Graph settings"
        >
          <div className="grid grid-cols-2 pb-6">
            <div>
              <div className="font-medium">Drag mode</div>
              <div className="text-hint text-xs">
                Move graph with your fingers
              </div>
            </div>
            <div className="py-2 rounded-2xl flex justify-end">
              <Switch
                label=""
                checked={graphDragMode}
                onChange={(checked) => {
                  if (checked) {
                    setGraphCooldownTicks(undefined);
                    setGraphWarmupTicks(undefined);
                  } else {
                    setGraphCooldownTicks(0);
                    setGraphWarmupTicks(30);
                  }
                  setGraphDragMode(checked);
                }}
              />
            </div>
            <div className="mt-4">
              <div className="font-medium">Show flags</div>
              <div className="text-hint text-xs">
                Help with navigation between folders
              </div>
            </div>
            <div className="py-2 rounded-2xl flex justify-end">
              <Switch
                label=""
                checked={showFolderFlags}
                onChange={(checked) => {
                  setShowFolderFlags(checked);
                }}
              />
            </div>
          </div>
        </BottomModal>,
        document.body
      )}
    </div>
  );
}
