import { useState } from "react";
import GridFlow from "./GridFlow";
import Tappable from "@/ui/Tappable";
import GridFlowMenu from "./GridFlowMenu";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";

export default function PinDesk() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-screen relative">
      <GridFlow />
      <MiniAppTopButton>
        <Tappable
          onClick={() => setShowMenu(!showMenu)}
          className="max-h-[32px] text-sm h-[32px] backdrop-blur-[25px] bg-button rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 border-[1px] border-[#252525]"
        >
          Workspace
          <SettingsIcon
            className={`h-4 w-4 text-white transition-transform duration-300 ${
              showMenu ? "rotate-180" : "rotate-0"
            }`}
          />
        </Tappable>
      </MiniAppTopButton>
      <GridFlowMenu show={showMenu} setShow={setShowMenu} />
    </div>
  );
}
