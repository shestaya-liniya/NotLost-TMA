import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getCssVariable } from "./get-css-variable";

export const getTopTgInset = () => {
  const lp = retrieveLaunchParams();

  if (["macos", "tdesktop"].includes(lp.tgWebAppPlatform)) {
    return 40;
  } else {
    return `calc(${getCssVariable("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariable("--tg-viewport-content-safe-area-inset-top")})`;
  }
};
