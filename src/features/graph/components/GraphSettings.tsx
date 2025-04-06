import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import Tappable from "@/ui/Tappable";
import { createPortal } from "react-dom";
import BottomModal from "@/ui/modals/BottomModal";
import Switch from "@/ui/Switch";

export default function GraphSettings(props: {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;
  graphDragModeEnabled: boolean;
  setGraphCooldownTicks: (val: number | undefined) => void;
  setGraphWarmupTicks: (val: number | undefined) => void;
  setGraphDragMode: (val: boolean) => void;
  showFolderFlags: boolean;
  setShowFolderFlags: (val: boolean) => void;
}) {
  return (
    <div>
      <Tappable
        onClick={() => props.setIsSettingsModalOpen(true)}
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
          isOpen={props.isSettingsModalOpen}
          onClose={() => props.setIsSettingsModalOpen(false)}
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
                checked={props.graphDragModeEnabled}
                onChange={(checked) => {
                  if (checked) {
                    props.setGraphCooldownTicks(undefined);
                    props.setGraphWarmupTicks(undefined);
                  } else {
                    props.setGraphCooldownTicks(0);
                    props.setGraphWarmupTicks(30);
                  }
                  props.setGraphDragMode(checked);
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
                checked={props.showFolderFlags}
                onChange={(checked) => {
                  props.setShowFolderFlags(checked);
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
