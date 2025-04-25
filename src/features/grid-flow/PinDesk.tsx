import { useState } from "react";
import GridFlow from "./GridFlow";
import GridFlowMenu from "./GridFlowMenu";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";

export default function PinDesk() {
  const [showMenu, setShowMenu] = useState(false);

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
      <GridFlowMenu show={showMenu} setShow={setShowMenu} />
    </div>
  );
}
