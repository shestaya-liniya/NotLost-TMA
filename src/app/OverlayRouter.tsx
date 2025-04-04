import { useNavigate, Routes, Route, Location } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import GraphWrapper from "@/features/graph/GraphWrapper";
import DialogInfo from "@/pages/DialogInfo";
import Settings from "@/pages/Settings";
import TelegramSignIn from "@/pages/TelegramSignIn";
import OverlayContent from "./OverlayContent";
import {
  isOverlayRoute,
  fadeAnimations,
  overlayAnimations,
  ROUTES,
} from "./routes";

interface OverlayRouterProps {
  location: Location;
}

export const OverlayRouter = ({ location }: OverlayRouterProps) => {
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isOverlayPage = isOverlayRoute(currentPath);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <AnimatePresence>
        {isOverlayPage && (
          <motion.div
            key="overlay-bg"
            variants={fadeAnimations}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ height: "var(--initial-height)" }}
            className="absolute top-0 left-0 w-screen bg-black/50 z-40"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOverlayPage && (
          <OverlayContent onClose={handleClose}>
            <motion.div
              key="overlay-content"
              variants={overlayAnimations}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full w-full"
            >
              <Routes location={location}>
                <Route path={ROUTES.DIALOG_INFO} element={<DialogInfo />} />
                <Route
                  path={ROUTES.TELEGRAM_SIGN_IN}
                  element={<TelegramSignIn />}
                />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.GRAPH} element={<GraphWrapper />} />
              </Routes>
            </motion.div>
          </OverlayContent>
        )}
      </AnimatePresence>
    </>
  );
};
