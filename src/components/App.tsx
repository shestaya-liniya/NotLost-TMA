import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TabBarLayout from "./TabBarLayout.tsx";
import Folders from "@/pages/Folders.tsx";
import ManageDialogsModal from "./ManageDialogsModal.jsx";
import Graph from "./graph/index.tsx";
import TelegramWallpaper from "@/ui/TelegramWallpaper.tsx";
import Tappable from "@/ui/Tappable.tsx";
import DialogInfo from "@/pages/DialogInfo.tsx";
import { useModalStore } from "@/lib/store/modal-store.tsx";
//import WebApp from "@twa-dev/sdk";

export default function App() {
  const [activeTab, setActiveTab] = useState("folders");
  const { dialogInfoModalOpen, setDialogInfoModalOpen } = useModalStore();

  return (
    <Routes>
      <Route
        path="/tab-bar"
        element={
          <div>
            <TabBarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <div className="relative w-screen h-full overflow-x-hidden">
                <TabTransition
                  direction="toRight"
                  isActive={activeTab === "folders"}
                >
                  <Folders />
                </TabTransition>
                <TabTransition
                  direction="toLeft"
                  isActive={activeTab === "try"}
                >
                  <Graph />
                </TabTransition>
              </div>
            </TabBarLayout>
            <ManageDialogsModal />
            <SlidingPage
              open={dialogInfoModalOpen}
              onClose={() => {
                setDialogInfoModalOpen(false);
                console.log("close");
              }}
            >
              <DialogInfo />
            </SlidingPage>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/tab-bar" />} />
    </Routes>
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
  useEffect(() => {
    if (open) {
      const webApp = (window as any)?.Telegram?.WebApp;
      const backButton = webApp.BackButton;
      backButton.show();
      backButton.onClick(() => {
        /* onClose();
        backButton.hide(); */
        console.log("back");
      });

      /* const mainButton = WebApp.MainButton;
      mainButton.setText("Back");
      mainButton.show();
      mainButton.onClick(() => {
        onClose();
        mainButton.hide();
      }); */
    }
  }, [open]);

  return (
    <div>
      <div
        className={`absolute top-0 left-0 w-screen h-screen bg-black/50 transition-all ease duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        className={`absolute top-0 left-0 w-screen h-screen bg-secondary transition-all ease duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <TelegramWallpaper />
        {children}
        {import.meta.env.DEV && (
          <div className="absolute bottom-0 left-0 w-screen h-16 bg-secondary flex justify-center items-center">
            <div className="flex justify-center items-center w-full px-4">
              <Tappable
                className="bg-link/30 text-center py-4 text-link rounded-2xl w-full font-semibold"
                onClick={onClose}
              >
                Go back
              </Tappable>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
