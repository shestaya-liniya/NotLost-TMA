import { getTelegramSession } from "@/helpers/telegram/telegramSession";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useAppStore } from "@/lib/store/store";
import AddDialogModal from "@/ui/modals/AddDialogModal";
import EditTagsModal from "@/ui/modals/EditTagsModal";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { OverlayRouter } from "./OverlayRouter";
import TabViewContainer from "./TabBar";
import { getTelegramDialogsAndSetToStore, setupTelegramTheme } from "./tg";

export default function App() {
  const location = useLocation();
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
      document.documentElement.setAttribute(
        "data-theme",
        jazzProfile.colorScheme
      );
    }
  }, [jazzProfile]);

  // Fetch Telegram dialogs
  useEffect(() => {
    if (getTelegramSession()) {
      getTelegramDialogsAndSetToStore();
    }
  }, []);

  return (
    <div style={{ height: "var(--initial-height)" }}>
      {/* Shadow input for keyboard */}
      <input
        type="text"
        className="hidden-input"
        id="shadow-input"
        value={shadowInputValue}
        onChange={(e) => setShadowInputValue(e.target.value)}
      />

      {/* Main content */}
      <TabViewContainer />

      {/* Modals */}
      <EditTagsModal />
      <AddDialogModal />

      {/* Overlay Routes with Sliding Animation */}
      <OverlayRouter location={location} />
    </div>
  );
}
