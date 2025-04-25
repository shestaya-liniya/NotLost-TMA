import { getTelegramSession } from "@/helpers/telegram/telegramSession";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useAppStore } from "@/lib/store/store";
import AddDialogModal from "@/ui/modals/AddDialogModal";
import EditTagsModal from "@/ui/modals/EditTagsModal";
import { useEffect } from "react";
//import TabViewContainer from "./TabBar";
import Graph from "@/features/graph/GraphWrapper";
import DialogInfo from "@/pages/DialogInfo";
import Settings from "@/pages/Settings";
import TelegramSync from "@/pages/TelegramSignIn";
import SlidingPage from "@/ui/SlidingPage";
import { useModalStore } from "@/lib/store/modalStore";
import { createPortal } from "react-dom";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { getTelegramDialogsAndSetToStore } from "./helpers/telegram/getTelegramDialogsAndSetToStore";
import PinDesk from "./features/grid-flow/PinDesk";
import Home from "./pages/Home";

export default function App() {
  const { jazzProfile } = useJazzProfileContext();
  const { shadowInputValue, setShadowInputValue } = useAppStore();

  // Setup Telegram theme
  useEffect(() => {
    setupTelegramTheme();

    // Capture the initial viewport height
    document.documentElement.style.setProperty(
      "--initial-height",
      `${window.innerHeight}px`
    );
  }, []);

  // Set color scheme
  useEffect(() => {
    if (!jazzProfile.colorScheme) {
      jazzProfile.colorScheme = "blue";
      document.documentElement.setAttribute("data-theme", "blue");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [jazzProfile]);

  useEffect(() => {
    // Fetch Telegram dialogs
    if (getTelegramSession()) {
      getTelegramDialogsAndSetToStore();
    }
  }, []);

  return (
    <div style={{ height: "var(--initial-height)" }}>
      {createPortal(<ModalsAndSlidingPages />, document.body)}
      {/* Shadow input for keyboard */}
      <input
        type="text"
        className="hidden-input"
        id="shadow-input"
        value={shadowInputValue}
        onChange={(e) => setShadowInputValue(e.target.value)}
      />

      {/* Didn't work, retry after whil */}
      {/* Unmount tab bar on any slider page appearing to free up ressources, especially for graph sliding page */}
      {/* <DelayedUnmount
        mounted={!isSlidingModalOpen}
        Wrapper={({ children }) => (
          <div className="h-full flex flex-col">{children}</div>
        )}
      >
        <KeepAlive cacheKey="tab-bar"> */}
      <Home />
      {/* </KeepAlive>
      </DelayedUnmount> */}
    </div>
  );
}

const ModalsAndSlidingPages = () => {
  const {
    dialogInfoModalOpen,
    setDialogInfoModalOpen,
    telegramSignInModalOpen,
    setTelegramSignInModalOpen,
    settingsModalOpen,
    setSettingsModalOpen,
    graphModalOpen,
    setGraphModalOpen,
    pinDeskOpen,
    setPinDeskOpen,
  } = useModalStore();
  return (
    <div>
      <EditTagsModal />
      <AddDialogModal />

      <SlidingPage
        open={pinDeskOpen}
        onClose={() => {
          setPinDeskOpen(false);
        }}
      >
        <PinDesk />
      </SlidingPage>

      <SlidingPage
        open={dialogInfoModalOpen}
        onClose={() => {
          setDialogInfoModalOpen(false);
        }}
      >
        <DialogInfo />
      </SlidingPage>
      <SlidingPage
        open={telegramSignInModalOpen}
        onClose={() => {
          setTelegramSignInModalOpen(false);
        }}
      >
        <TelegramSync />
      </SlidingPage>
      <SlidingPage
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      >
        <Settings />
      </SlidingPage>
      <SlidingPage
        open={graphModalOpen}
        onClose={() => setGraphModalOpen(false)}
      >
        <Graph />
      </SlidingPage>
    </div>
  );
};

const setupTelegramTheme = (): void => {
  const lp = retrieveLaunchParams();
  const tp = lp.tgWebAppThemeParams;

  const style = document.createElement("style");
  style.innerHTML = `:root { 
    --tg-bg-color: ${tp.bg_color};
    --tg-theme-secondary-bg-color: ${tp.secondary_bg_color};
    --tg-theme-link-color: ${tp.link_color};
    --tg-theme-accent-text-color: ${tp.accent_text_color};
    --tg-theme-hint-color: ${tp.hint_color};
    --tg-theme-button-color: ${tp.button_color};
    --tg-theme-text-color: ${tp.text_color};
    ${["macos", "tdesktop"].includes(lp.tgWebAppPlatform) && "--tg-viewport-safe-area-inset-top: 20px; --tg-viewport-content-safe-area-inset-top: 20px"}
  }`;
  document.head.appendChild(style);
};
