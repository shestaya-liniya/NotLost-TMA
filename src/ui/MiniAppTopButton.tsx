import { getCssVariable } from "@/helpers/css/getCssVariable";
import { ReactNode } from "react";
import Tappable from "./Tappable";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const MiniAppTopButton = (props: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) => {
  const lp = retrieveLaunchParams();

  return (
    <div
      style={{
        top:
          Number(
            getCssVariable("--tg-viewport-safe-area-inset-top")?.replace(
              "px",
              ""
            )
          ) || 0,
        height:
          Number(
            getCssVariable(
              "--tg-viewport-content-safe-area-inset-top"
            )?.replace("px", "")
          ) || 0,
      }}
      className="absolute w-screen grid place-items-center"
    >
      <Tappable
        onTap={props.onClick}
        style={{
          color: props.active ? "black" : "white",
          background: props.active
            ? "white"
            : lp.tgWebAppPlatform === "ios"
              ? "#2f2f2f"
              : "var(--color-button)",
          border:
            lp.tgWebAppPlatform === "ios"
              ? ""
              : "1px solid var(--color-secondary)",
        }}
        className="max-h-[32px] h-[32px] text-sm backdrop-blur-[25px] rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 transition-background ease duration-300"
      >
        {props.children}
      </Tappable>
    </div>
  );
};
