import { PropsWithChildren } from "react";

function TelegramProvider({ children }: PropsWithChildren) {
  /* useEffect(() => {
    try {
      if (initData) {
        if (
          !["macos", "tdesktop"].includes(
            retrieveLaunchParams().tgWebAppPlatform
          )
        ) {
          if (
            ["ios", "android"].includes(retrieveLaunchParams().tgWebAppPlatform)
          ) {
            postEvent("web_app_request_fullscreen");
          }

          postEvent("web_app_setup_swipe_behavior", {
            allow_vertical_swipe: false,
          });
        }
      }
    } catch (e) {
      console.log("ERROR TG", e);
      console.log("The app runs outside of the telegram");
    }
  }, []); */
  return <>{children}</>;
}

export default TelegramProvider;
