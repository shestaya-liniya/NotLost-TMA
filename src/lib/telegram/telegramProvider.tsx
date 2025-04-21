import { PropsWithChildren, useEffect } from "react";

import {
  initData,
  postEvent,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";

function TelegramProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    try {
      if (initData) {
        if (
          !["macos", "tdesktop"].includes(
            retrieveLaunchParams().tgWebAppPlatform
          )
        ) {
          postEvent("web_app_expand");
          if (
            ["ios", "android"].includes(retrieveLaunchParams().tgWebAppPlatform)
          ) {
            postEvent("web_app_request_fullscreen");
          }

          postEvent("web_app_setup_swipe_behavior", {
            allow_vertical_swipe: false,
          });
          postEvent("web_app_set_header_color", {
            color: "#fff",
          });
        }
      }
    } catch (e) {
      console.log("ERROR TG", e);
      console.log("The app runs outside of the telegram");
    }
  }, []);
  return <>{children}</>;
}

export default TelegramProvider;
