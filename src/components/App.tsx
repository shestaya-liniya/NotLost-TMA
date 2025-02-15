import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import TabBarLayout from "./TabBarLayout.tsx";
import Folders from "@/pages/Folders.tsx";
import ManageDialogsModal from "./ManageDialogsModal.jsx";
import Graph from "./graph/index.tsx";
import TelegramWallpaper from "@/ui/TelegramWallpaper.tsx";
import Tappable from "@/ui/Tappable.tsx";
import DialogInfo from "@/pages/DialogInfo.tsx";
import { useModalStore } from "@/lib/store/modal-store.tsx";
import { backButton } from "@telegram-apps/sdk-react";
import EditTagsModal from "./EditTagsModal.tsx";
import Settings from "@/pages/Settings.tsx";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider.tsx";
import { useAppStore } from "@/lib/store/store.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState("folders");
  const { dialogInfoModalOpen, setDialogInfoModalOpen } = useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const tabs = ["try", "folders", "settings"];
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

  // Capture the initial viewport height
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--initial-height",
      `${window.innerHeight}px`
    );
  }, []);

  const { shadowInputValue, setShadowInputValue } = useAppStore();

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
                    direction={direction}
                    isActive={activeTab === "folders"}
                  >
                    <Folders />
                  </TabTransition>
                  <TabTransition
                    direction={direction}
                    isActive={activeTab === "try"}
                  >
                    <Graph />
                  </TabTransition>
                  <TabTransition
                    direction={"toRight"}
                    isActive={activeTab === "settings"}
                  >
                    <Settings />
                  </TabTransition>
                </div>
              </TabBarLayout>
              <ManageDialogsModal />
              <EditTagsModal />
              <SlidingPage
                open={dialogInfoModalOpen}
                onClose={() => {
                  setDialogInfoModalOpen(false);
                }}
              >
                <DialogInfo />
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
    backButton.hide();
  };
  useEffect(() => {
    if (open) {
      backButton.show();
      backButton.onClick(handleClose);
    }
  }, [open]);
  return (
    <div
      style={{
        height: "var(--viewport-height)",
      }}
    >
      <div
        style={{
          height: "var(--viewport-height)",
        }}
        className={`absolute top-0 left-0 w-screen bg-black/50 transition-all ease duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`absolute h-full top-0 left-0 w-screen bg-secondary transition-all ease duration-500 ${
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
