import { getCssVariable } from "@/helpers/css/getCssVariable";
import { ReactNode } from "react";

export const MiniAppTopButton = ({ children }: { children: ReactNode }) => {
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
      {children}
    </div>
  );
};
