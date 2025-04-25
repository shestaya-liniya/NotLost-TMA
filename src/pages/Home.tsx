import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { useModalStore } from "@/lib/store/modalStore";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import Tappable from "@/ui/Tappable";
import MenuIcon from "@/assets/icons/menu.svg?react";
import { useState } from "react";
import MiniAppTopMenu, {
  MiniAppTopMenuDivider,
  MiniAppTopMenuItem,
} from "@/ui/MiniAppTopMenu";
import CrownIcon from "@/assets/icons/crown.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";

export default function Home() {
  const { setPinDeskOpen } = useModalStore();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="h-screen relative">
      <MiniAppTopButton>
        <Tappable
          onClick={() => setShowMenu(true)}
          className="max-h-[32px] h-[32px] text-sm backdrop-blur-[25px] bg-button rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 border-[1px] border-[#252525]"
        >
          NotLost
          <MenuIcon
            className={`h-3 w-3 text-white transition-transform duration-300 ${
              showMenu ? "rotate-90" : "rotate-0"
            }`}
          />
        </Tappable>
      </MiniAppTopButton>
      <MiniAppTopMenu show={showMenu} setShow={setShowMenu}>
        <MiniAppTopMenuItem>
          <CrownIcon className="h-4 w-4 text-link" />
          <div>Premium</div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <GraphIcon className="h-4 w-4 scale-130" />
          <div>Graph</div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <SettingsIcon className="h-4 w-4" />
          <div>Settings</div>
        </MiniAppTopMenuItem>
      </MiniAppTopMenu>

      <div
        style={{
          paddingTop: getMiniAppTopInset() + 10,
        }}
      >
        <Tappable onClick={() => setPinDeskOpen(true)}>PIN DESK</Tappable>
      </div>
    </div>
  );
}
