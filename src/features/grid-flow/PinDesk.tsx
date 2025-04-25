import { useState } from "react";
import GridFlow from "./GridFlow";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import MiniAppTopMenu, {
  MiniAppTopMenuItem,
  MiniAppTopMenuDivider,
} from "@/ui/MiniAppTopMenu";
import { usePinDeskStore } from "./PinDeskStore";

export default function PinDesk() {
  const [showMenu, setShowMenu] = useState(false);
  const { nodesDraggable, setNodesDraggable } = usePinDeskStore();

  return (
    <div className="h-screen relative">
      <GridFlow />
      <MiniAppTopButton onClick={() => setShowMenu(true)}>
        Workspace
        <SettingsIcon
          className={`h-4 w-4 text-white transition-transform duration-300 ${
            showMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </MiniAppTopButton>
      <MiniAppTopMenu show={showMenu} setShow={setShowMenu}>
        <MiniAppTopMenuItem
          action={() => setNodesDraggable(!nodesDraggable)}
          active={nodesDraggable}
        >
          <GrabIcon className="w-6 h-6" />
          <div>Move</div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <PlusIcon className="w-6 h-6" />
          <div>Add</div>
        </MiniAppTopMenuItem>
      </MiniAppTopMenu>
    </div>
  );
}
