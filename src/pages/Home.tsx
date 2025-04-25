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
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import VerticalScrollableList from "@/ui/VerticalScrollableList";
import GridFlow from "@/features/grid-flow/GridFlow";
import Tappable from "@/ui/Tappable";
import { useModalStore } from "@/lib/store/modalStore";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const { setPinDeskOpen } = useModalStore();
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
          paddingTop: getMiniAppTopInset() + 20,
        }}
        className="px-4"
      >
        <div>
          <div className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2">
            <div className="text-xs">All workspaces</div>
            <ChevronRightIcon className="h-3 w-3" />
          </div>
          <VerticalScrollableList className="-ml-4 -mr-4 px-4 pt-3">
            <li>
              <Tappable
                onClick={() => setPinDeskOpen(true)}
                className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
              >
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <GridFlow />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </Tappable>
            </li>
            <li>
              <div className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary">
                <div className="absolute -top-10 -left-30 w-100 h-30 -scale-30 pointer-events-none">
                  <GridFlow />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary">
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <GridFlow />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary">
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <GridFlow />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </div>
            </li>
          </VerticalScrollableList>
        </div>
      </div>
    </div>
  );
}
