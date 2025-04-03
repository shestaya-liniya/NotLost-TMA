import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Ai from "@/pages/Ai";
import Events from "@/pages/Events";
import Folders from "@/pages/Folders";
import TabBarLayout from "@/ui/tab-bar/TabBarLayout";
import { tabAnimations, ROUTES } from "./routes";

const TabViewContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [direction, setDirection] = useState(0);
  const prevPathRef = useRef(location.pathname);

  const activeTab = location.pathname.split("/").pop() || "folders";

  useEffect(() => {
    const tabs = ["ai", "folders", "events"];
    const currentIndex = tabs.indexOf(activeTab);
    const previousIndex = tabs.indexOf(
      prevPathRef.current.split("/").pop() || "folders"
    );

    setDirection(currentIndex > previousIndex ? 1 : -1);
    prevPathRef.current = location.pathname;
  }, [activeTab, location.pathname]);

  return (
    <TabBarLayout
      activeTab={activeTab}
      setActiveTab={(tab) => navigate(`/${tab}`)}
    >
      <div className="relative w-screen h-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={tabAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-screen h-full absolute top-0 left-0"
          >
            <Routes location={location}>
              <Route path={ROUTES.AI} element={<Ai />} />
              <Route path={ROUTES.FOLDERS} element={<Folders />} />
              <Route path={ROUTES.EVENTS} element={<Events />} />
              <Route path="*" element={<Navigate to={ROUTES.FOLDERS} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </TabBarLayout>
  );
};

export default TabViewContainer;
