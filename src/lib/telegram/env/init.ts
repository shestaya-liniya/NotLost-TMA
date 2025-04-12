import {
  backButton,
  viewport,
  miniApp,
  initData,
  setDebug,
  init as initSDK,
  themeParams,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(debug: boolean): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode.
  setDebug(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.

  // Without a try catch block return sdk error (?)
  try {
    initSDK();
  } catch (e) {
    console.log(e);
  }

  // Mount all components used in the project.

  backButton.mount();
  initData.restore();

  if (themeParams.bindCssVars.isAvailable()) {
    themeParams.bindCssVars();
  }

  if (viewport.mount.isAvailable()) {
    try {
      const promise = viewport.mount();
      await promise;
      if (viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }
      viewport.bindCssVars();
    } catch (err) {
      viewport.mountError(); // equals "err"
      viewport.isMounting(); // false
      viewport.isMounted(); // false
    }
  }

  if (miniApp.mount.isAvailable()) {
    try {
      const promise = miniApp.mount();
      await promise;
      miniApp.bindCssVars();
    } catch (err) {
      miniApp.mountError(); // equals "err"
      miniApp.isMounting(); // false
      miniApp.isMounted(); // false
    }
  }

  const webApp = (window as any)?.Telegram?.WebApp;
  if (webApp) {
    try {
      webApp.disableVerticalSwipes();
    } catch (e) {
      console.log("Error requesting fullscreen", e);
    }
  }
  // Add Eruda if needed.
  /* debug &&
    import("eruda").then((lib) => lib.default.init()).catch(console.error); */
}
