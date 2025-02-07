import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import TabBarLayout from "./TabBarLayout.tsx";
import Folders from "@/pages/Folders";
import ManageDialogsModal from "./ManageDialogsModal.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("folders");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFoldersTabActive = activeTab === "folders";
  const isTryTabActive = activeTab === "try";

  //const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  console.log(isModalOpen);

  return (
    <Router>
      <Routes>
        <Route
          path="/tab"
          element={
            <div>
              <TabBarLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="relative w-screen h-full overflow-x-hidden">
                  <TabTransition
                    direction="toRight"
                    isActive={isFoldersTabActive}
                  >
                    <Folders openDialogsModal={openModal} />
                  </TabTransition>
                  <TabTransition direction="toLeft" isActive={isTryTabActive}>
                    <Folders openDialogsModal={openModal} />
                  </TabTransition>
                </div>
                <div>Hello</div>
              </TabBarLayout>
              <ManageDialogsModal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
              />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/tab" />} />
      </Routes>
    </Router>
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
