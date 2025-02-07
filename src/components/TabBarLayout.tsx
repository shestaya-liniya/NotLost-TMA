import tgWallpaper from "@/assets/tg-wallpaper-paris.svg";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";

export default function TabBarLayout({
  activeTab,
  setActiveTab,
  children,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="flex-1 overflow-auto text-white relative">
        {/* <div
          className="h-full w-full -z-10 absolute bg-link/5"
          style={{ mask: `url(${tgWallpaper}) center / contain` }}
        /> */}
        <div
          style={{
            paddingTop:
              "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
          }}
          className="h-full"
        >
          {children}
          {/* <div>Hello</div> */}
        </div>
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function TabBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="bg-primary">
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-4">
        <div className="flex justify-around items-center">
          <BottomBarLink
            onClick={() => setActiveTab("try")}
            title="Try"
            isActive={activeTab === "try"}
            Icon={GraphIcon}
          />
          <BottomBarLink
            onClick={() => setActiveTab("folders")}
            title="Folders"
            isActive={activeTab === "folders"}
            Icon={FolderIcon}
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
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      onTouchStart={onClick}
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
          <div className={`h-6 w-6 ${isActive ? "text-link" : "text-white"}`}>
            <Icon />
          </div>
        </div>
      </div>
      <span
        className={`font-medium ${isActive ? "px-2 rounded-2xl text-accent" : ""}`}
      >
        {title}
      </span>
    </div>
  );
}
