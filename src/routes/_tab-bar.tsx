import {
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import SearchIcon from "@/assets/icons/search-icon.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import React from "react";
import { Route as ContactsRoute } from "@/routes/_tab-bar/dialogs";
import { Route as TryRoute } from "@/routes/_tab-bar/try";
import tgWallpaper from "@/assets/tg-wallpaper-paris.svg";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";

export default function TabBar() {
  return (
    <div className="bg-primary border-t-[1px] border-primary">
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-4">
        <div className="flex justify-around items-center">
          <BottomBarLink to={TryRoute.to} title="Try" Icon={<GraphIcon />} />
          <BottomBarLink
            to={ContactsRoute.to}
            title="Search"
            Icon={
              <div className="p-[2px]">
                <SearchIcon />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

interface BottomBarLinkProps {
  to: string;
  title: string;
  Icon: React.ReactElement;
}

const BottomBarLink: React.FC<BottomBarLinkProps> = ({ to, title, Icon }) => {
  const router = useRouter();
  const { pathname } = useLocation();

  const isActive = pathname.concat("/").includes(to);
  const handleClick = () => {
    router.navigate({ to });
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full text-[12px] flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-300 ease-in-out`}
    >
      <div
        className={`h-8 w-8 rounded-full transition-all duration-150 ease-in-out ${
          isActive ? "bg-link/20" : "bg-transparent"
        }`}
      >
        <div
          style={{
            color: isActive
              ? getCssVariable("--tg-theme-accent-text-color")
              : "white",
            padding: isActive ? 6 : 4,
          }}
          className="flex items-center justify-center transition-all duration-300 ease-in-out"
        >
          <div className={`h-6 w-6 ${isActive ? "text-link" : "text-white"}`}>
            {Icon}
          </div>
        </div>
      </div>
      <span
        className={`font-medium ${
          isActive ? "px-2 rounded-2xl text-accent" : ""
        }`}
      >
        {title}
      </span>
    </div>
  );
};

function LayoutComponent() {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="flex-1 overflow-auto text-white">
        <div
          className="h-full w-full -z-10 absolute"
          style={{
            mask: `url(${tgWallpaper}) center / contain`,
            backgroundColor: `${hexToRgba(getCssVariable("--tg-theme-link-color"), 0.05)}`,
          }}
        ></div>
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}

export const Route = createFileRoute("/_tab-bar")({
  component: LayoutComponent,
});
