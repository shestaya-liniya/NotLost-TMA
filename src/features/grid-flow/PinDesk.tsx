import { useState } from "react";
import GridFlow from "./GridFlow";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import Tappable from "@/ui/Tappable";
import GridFlowMenu from "./GridFlowMenu";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";

export default function PinDesk() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-screen relative">
      <GridFlow />
      <Tappable
        onClick={() => setShowMenu(!showMenu)}
        style={{
          top: -getMiniAppTopInset() / 2,
        }}
        className="absolute left-1/2 text-sm max-h-[32px] h-[32px] -translate-x-1/2 backdrop-blur-[25px] bg-black/20 rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 border-[1px] border-[#252525]"
      >
        Workspace
        <SettingsIcon
          className={`h-4 w-4 text-white transition-transform duration-300 ${
            showMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </Tappable>
      <GridFlowMenu show={showMenu} setShow={setShowMenu} />
    </div>
  );
}
