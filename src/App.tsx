import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import TabBarLayout from "./ui/tab-bar/TabBarLayout.tsx";
import Folders from "@/pages/Folders.tsx";
import ManageDialogsModal from "./ui/modals/ManageDialogsModal.js";
import Graph from "./components/graph/index.tsx";
import TelegramWallpaper from "@/ui/TelegramWallpaper.tsx";
import Tappable from "@/ui/Tappable.tsx";
import DialogInfo from "@/pages/DialogInfo.tsx";
import { useModalStore } from "@/lib/store/modal-store.tsx";
import { backButton } from "@telegram-apps/sdk-react";
import EditTagsModal from "./ui/modals/EditTagsModal.tsx";
import Settings from "@/pages/Settings.tsx";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider.tsx";
import { useAppStore } from "@/lib/store/store.ts";
import AddDialogModal from "./ui/modals/AddDialogModal.tsx";
import TelegramSignIn from "./pages/TelegramSignIn.tsx";
import Ai from "./pages/Ai.tsx";
import { $getMyDialogs } from "./actions/telegram.ts";
import { TelegramDialogInfo } from "./lib/telegram/api/telegram-api-client.ts";
import { getTelegramSession } from "./helpers/telegram/getTelegramSession.ts";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

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

  import("eruda").then((lib) => lib.default.init()).catch(console.error);
  const tp = retrieveLaunchParams().tgWebAppThemeParams;
  /* --color-primary: var(--tg-bg-color);
  --color-secondary: var(--tg-theme-secondary-bg-color);

  --color-link: var(--tg-theme-link-color);
  --color-accent: var(--tg-theme-accent-text-color);
  --color-hint: var(--tg-theme-hint-color);
  --color-button: var(--tg-theme-button-color);
  --color-default: var(--tg-theme-text-color); */
  const style = document.createElement("style");
  style.innerHTML = `:root { 
  --tg-bg-color: ${tp.bg_color};
  --tg-theme-secondary-bg-color: ${tp.secondary_bg_color};
  --tg-theme-link-color: ${tp.link_color};
  --tg-theme-accent-text-color: ${tp.accent_text_color};
  --tg-theme-hint-color: ${tp.hint_color};
  --tg-theme-button-color: ${tp.button_color};
  --tg-theme-text-color: ${tp.text_color};
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
        onFocus={() => console.log("focus")}
        onChange={(e) => setShadowInputValue(e.target.value)}
      />
      <Routes>
        <Route
          path="/tab-bar"
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
                    Events
                  </TabTransition>
                </div>
              </TabBarLayout>
              <ManageDialogsModal />
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
        console.log(backButton.isSupported());
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
        <TelegramWallpaper />
        {children}

        <div className="absolute bottom-0 left-0 w-screen h-16 bg-secondary flex justify-center items-center">
          <div className="flex justify-center items-center w-full px-4 pb-4">
            <Tappable
              className="bg-button text-center py-3 text-white rounded-2xl w-full font-semibold"
              onClick={handleClose}
            >
              Go back
            </Tappable>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getTelegramDialogsAndSetToStore = async () => {
  const { setTelegramDialogs } = useAppStore.getState();

  const tempDialogs: TelegramDialogInfo[] = [];

  await $getMyDialogs().then((dialogs) => {
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
