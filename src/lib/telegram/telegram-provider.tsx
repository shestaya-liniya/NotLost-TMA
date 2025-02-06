import * as TelegramUI from "@telegram-apps/telegram-ui";
import { PropsWithChildren, useEffect } from "react";
const { AppRoot } = TelegramUI;

import {
  initData,
  postEvent,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";

function TelegramProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    try {
      if (initData) {
        if (!["macos", "tdesktop"].includes(retrieveLaunchParams().platform)) {
          postEvent("web_app_expand");
          /* postEvent("web_app_request_fullscreen"); */
          postEvent("web_app_setup_swipe_behavior", {
            allow_vertical_swipe: false,
          });
        }
      }
    } catch (e) {
      console.log("ERROR TG", e);
      console.log("The app runs outside of the telegram");
    }
  }, []);
  return (
    <AppRoot appearance={"dark"} platform={"ios"}>
      {children}
    </AppRoot>
  );
}

export default TelegramProvider;
