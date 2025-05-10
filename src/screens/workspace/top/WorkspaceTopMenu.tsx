import MiniAppTopMenu, { MiniAppTopMenuItem } from "@/ui/MiniAppTopMenu";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PinIcon from "@/assets/icons/pin.svg?react";
import {
  useWorkspaceModalsActions,
  useWorkspaceModalsStore,
} from "../.store/WorkspaceModals.store";
import {
  useWorkspaceActions,
  useWorkspaceStore,
} from "../.store/Workspace.store";
import { memo } from "react";

function WorkspaceTopMenu() {
  const moveModeEnabled = useWorkspaceStore((s) => s.moveModeEnabled);
  const unpinModeEnabled = useWorkspaceStore((s) => s.unpinModeEnabled);
  const showTopMenu = useWorkspaceModalsStore((s) => s.showTopMenu);

  const { setMoveModeEnabled, setUnpinModeEnabled } = useWorkspaceActions();
  const { setShowTopMenu, setShowPinModal } = useWorkspaceModalsActions();

  return (
    <MiniAppTopMenu show={showTopMenu} setShow={setShowTopMenu}>
      <MiniAppTopMenuItem
        action={() => {
          setMoveModeEnabled(!moveModeEnabled);
          setShowTopMenu(false);
        }}
        active={moveModeEnabled}
      >
        <div>Move</div>
        <GrabIcon className="w-6 h-6" />
      </MiniAppTopMenuItem>
      <MiniAppTopMenuItem
        action={() => {
          setUnpinModeEnabled(!unpinModeEnabled);
          setShowTopMenu(false);
        }}
        active={unpinModeEnabled}
      >
        <div>Unpin</div>
        <div className="relative">
          <PinIcon className="w-4 h-4 ml-2 relative right-1" />
          <div className="absolute -top-[7px] left-[9px] -rotate-60 text-lg font-light">
            /
          </div>
        </div>
      </MiniAppTopMenuItem>
      <MiniAppTopMenuItem
        action={() => {
          setShowPinModal(true);
          setShowTopMenu(false);
        }}
      >
        <div>Add</div>
        <PlusIcon className="w-6 h-6" />
      </MiniAppTopMenuItem>
    </MiniAppTopMenu>
  );
}

export default memo(WorkspaceTopMenu);
