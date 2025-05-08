import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import MenuIcon from "@/assets/icons/telegram.svg?react";
import { useState } from "react";
import MiniAppTopMenu, {
  MiniAppTopMenuDivider,
  MiniAppTopMenuItem,
} from "@/ui/MiniAppTopMenu";
import CrownIcon from "@/assets/icons/crown.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { useModalStore } from "@/lib/store/modalStore";
import WorkspacesSection from "@/screens/home/sections/workspaces/WorkspacesSection";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const { setSettingsModalOpen } = useModalStore();

  return (
    <div className="h-screen relative">
      <MiniAppTopButton onClick={() => setShowMenu(true)}>
        <MenuIcon
          className={`h-4 w-4 text-white transition-transform duration-300`}
        />
        NotLost
      </MiniAppTopButton>
      <MiniAppTopMenu show={showMenu} setShow={setShowMenu}>
        <MiniAppTopMenuItem>
          <div className="flex gap-2 text-hint items-center">
            <div>Premium</div>
            <CrownIcon className="h-4 w-4" />
          </div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <div className="flex gap-2 text-hint items-center justify-between w-full">
            <div>Graph</div>
            <GraphIcon className="h-4 w-4 scale-130" />
          </div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem
          action={() => {
            setShowMenu(false);
            setSettingsModalOpen(true);
          }}
        >
          <div>Settings</div>
          <SettingsIcon className="h-4 w-4" />
        </MiniAppTopMenuItem>
      </MiniAppTopMenu>
      <div
        style={{
          paddingTop: getMiniAppTopInset() + 20,
        }}
        className="px-4"
      >
        <WorkspacesSection />
      </div>
    </div>
  );
}
