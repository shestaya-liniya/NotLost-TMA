import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import TabBarLayout from "./ui/tab-bar/TabBarLayout.tsx";
import Folders from "@/pages/Folders.tsx";
import Graph from "./features/graph/GraphWrapper.tsx";
import TelegramWallpaper from "@/ui/TelegramWallpaper.tsx";
import Tappable from "@/ui/Tappable.tsx";
import DialogInfo from "@/pages/DialogInfo.tsx";
import { useModalStore } from "@/lib/store/modalStore.tsx";
import { backButton } from "@telegram-apps/sdk-react";
import EditTagsModal from "./ui/modals/EditTagsModal.tsx";
import Settings from "@/pages/Settings.tsx";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider.tsx";
import { useAppStore } from "@/lib/store/store.ts";
import AddDialogModal from "./ui/modals/AddDialogModal.tsx";
import TelegramSignIn from "./pages/TelegramSignIn.tsx";
import Ai from "./pages/Ai.tsx";
import { telegramActionGetDialogs } from "./lib/telegram/api/telegramActions.ts";
import { TelegramDialogInfo } from "./lib/telegram/api/telegramApiClient.ts";
import { getTelegramSession } from "./helpers/telegram/telegramSession.ts";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import Events from "./pages/Events.tsx";

export default function App() {
  const {
    dialogInfoModalOpen,
    setDialogInfoModalOpen,
    telegramSignInModalOpen,
    setTelegramSignInModalOpen,
    settingsModalOpen,
    setSettingsModalOpen,
    graphModalOpen,
    setGraphModalOpen,
  } = useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const [activeTab, setActiveTab] = useState("folders");
  const tabs = ["ai", "folders", "events"];
  const previousIndex = useRef(0);

  const direction =
    tabs.indexOf(activeTab) > previousIndex.current ? "toLeft" : "toRight";

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

  useEffect(() => {
    if (getTelegramSession()) {
      getTelegramDialogsAndSetToStore();
    }
  }, []);

  // Capture the initial viewport height
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--initial-height",
      `${window.innerHeight}px`
    );
  }, []);

  const { shadowInputValue, setShadowInputValue } = useAppStore();

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

  return (
    <div>
      {/* shadow input is used to trigger keyboard */}
      <input
        type="text"
        className="hidden-input"
        id="shadow-input"
        value={shadowInputValue}
        onChange={(e) => setShadowInputValue(e.target.value)}
      />
      <Routes>
        <Route
          path="/tab-bar/*"
          element={
            <div style={{ height: "var(--initial-height)" }}>
              <TabBarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="relative w-screen h-full overflow-x-hidden">
                  <TabTransition
                    direction={"toLeft"}
                    isActive={activeTab === "ai"}
                  >
                    <Ai />
                  </TabTransition>
                  <TabTransition
                    direction={direction}
                    isActive={activeTab === "folders"}
                  >
                    <Folders />
                  </TabTransition>
                  <TabTransition
                    direction={"toRight"}
                    isActive={activeTab === "events"}
                  >
                    <Events />
                  </TabTransition>
                </div>
              </TabBarLayout>
              <EditTagsModal />
              <AddDialogModal />
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
                <TelegramSignIn />
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
          }
        />
        <Route path="*" element={<Navigate to="/tab-bar" />} />
      </Routes>
    </div>
  );
}

function TabTransition({
  children,
  direction,
  isActive,
}: {
  children: React.ReactNode;
  direction: "toRight" | "toLeft";
  isActive: boolean;
}) {
  return (
    <div
      className={`w-screen h-full absolute top-0 left-0 transition-all ease ${isActive ? "duration-300 translate-x-0 scale-100" : `duration-300 ${direction === "toRight" ? "translate-x-full" : "-translate-x-full"} -z-10 opacity-0 scale-90`}`}
    >
      {children}
    </div>
  );
}

function SlidingPage({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
    if (backButton.isSupported()) {
      backButton.hide();
    }
  };
  useEffect(() => {
    if (open) {
      if (backButton.isSupported()) {
        try {
          backButton.show();
          backButton.onClick(handleClose);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [open]);
  return (
    <div>
      <div
        style={{
          height: "var(--initial-height)",
        }}
        className={`absolute top-0 left-0 w-screen bg-black/50 transition-all ease duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        style={{
          height: "var(--initial-height)",
        }}
        className={`absolute top-0 left-0 w-screen bg-secondary transition-all ease duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {import.meta.env.MODE === "development" && (
          <Tappable
            onClick={handleClose}
            className="top-5 left-5 absolute bg-link/10 rounded-2xl px-2 py-1 text-link z-[1000px]"
          >
            Back
          </Tappable>
        )}
        <TelegramWallpaper />
        {children}

        {/* <div className="absolute bottom-0 left-0 w-screen h-16 bg-secondary flex justify-center items-center">
          <div className="flex justify-center items-center w-full px-4 pb-4">
            <Tappable className="bg-button text-center py-3 text-white rounded-2xl w-full font-semibold">
              Go back
            </Tappable>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export const getTelegramDialogsAndSetToStore = async () => {
  const { setTelegramDialogs } = useAppStore.getState();

  const tempDialogs: TelegramDialogInfo[] = [];

  await telegramActionGetDialogs().then((dialogs) => {
    dialogs.forEach((d) => {
      if (d.entity?.className === "User") {
        if (!d.entity.username) return;
        const userInfo = {
          label: d.entity.firstName || "X",
          username: d.entity.username || "X",
          id: d.entity.id,
        };
        tempDialogs.push(userInfo);
      } else if (d.entity?.className === "Channel") {
        if (!d.entity.username) return;
        const userInfo = {
          label: d.entity.title || "X",
          username: d.entity.username || "X",
          id: d.entity.id,
        };
        tempDialogs.push(userInfo);
      }
    });
  });

  setTelegramDialogs(tempDialogs);
};
