import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getCssVariable } from "./get-css-variable";

export const getMiniAppTopInset = () => {
  const lp = retrieveLaunchParams();

  if (["macos", "tdesktop"].includes(lp.tgWebAppPlatform)) {
    return 20;
  } else {
    const safeTop =
      Number(
        getCssVariable("--tg-viewport-safe-area-inset-top")?.replace("px", "")
      ) || 0;
    const safeContentTop =
      Number(
        getCssVariable("--tg-viewport-content-safe-area-inset-top")?.replace(
          "px",
          ""
        )
      ) || 0;

    return safeTop + safeContentTop;
  }
};
