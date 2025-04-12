import FolderIcon from "@/assets/icons/folder.svg?react";
import TelegramWallpaper from "@/ui/TelegramWallpaper";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import AiIcon from "@/assets/icons/ai-icon-1.svg?react";
import { TabbarTab } from "@/TabBar";

export default function TabBarLayout({
  activeTab,
  setActiveTab,
  children,
}: {
  activeTab: TabbarTab;
  setActiveTab: (tab: TabbarTab) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto relative">
        <TelegramWallpaper />
        <div className="h-full">{children}</div>
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function TabBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabbarTab;
  setActiveTab: (tab: TabbarTab) => void;
}) {
  return (
    <div className="bg-secondary border-t-2 border-primary/30" id="tab-bar">
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-4">
        <div className="flex justify-around items-center">
          <BottomBarLink
            onClick={() => setActiveTab("ai")}
            title="AI"
            isActive={activeTab === "ai"}
            Icon={<AiIcon className="scale-300 ml-1" />}
          />
          <BottomBarLink
            onClick={() => setActiveTab("folders")}
            title="Folders"
            isActive={activeTab === "folders"}
            Icon={<FolderIcon />}
          />
          <BottomBarLink
            onClick={() => setActiveTab("settings")}
            title="Settings"
            isActive={activeTab === "settings"}
            Icon={<SettingsIcon />}
          />
        </div>
      </div>
    </div>
  );
}

function BottomBarLink({
  onClick,
  title,
  isActive,
  Icon,
}: {
  onClick: () => void;
  title: string;
  isActive: boolean;
  Icon: React.ReactElement;
}) {
  return (
    <div
      onPointerDown={onClick}
      className="w-full text-[12px] flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-150 ease-in-out"
    >
      <div
        className={`h-8 w-8 rounded-full transition-all duration-150 ease-in-out ${
          isActive ? "bg-link/10" : "bg-transparent"
        }`}
      >
        <div
          style={{
            color: isActive ? "#008080" : "white",
            padding: isActive ? "6px" : "4px",
          }}
          className="flex items-center justify-center transition-all duration-70 ease-in-out"
        >
          <div
            className={`h-6 w-6 ${isActive ? "text-link" : "text-link opacity-70"}`}
          >
            {Icon}
          </div>
        </div>
      </div>
      <span
        className={`font-medium ${isActive ? "px-2 rounded-2xl text-accent" : "text-link opacity-70"}`}
      >
        {title}
      </span>
    </div>
  );
}
