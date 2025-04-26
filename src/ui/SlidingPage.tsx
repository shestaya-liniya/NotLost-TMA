import { backButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import TelegramWallpaper from "./TelegramWallpaper";
import { useModalStore } from "@/lib/store/modalStore";
import { AnimatePresence, motion } from "framer-motion";

export default function SlidingPage({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) {
  const { setIsSlidingModalOpen } = useModalStore();
  const handleClose = () => {
    onClose();
    setIsSlidingModalOpen(false);
    if (backButton.isSupported()) {
      backButton.hide();
    }
  };
  useEffect(() => {
    setIsSlidingModalOpen(open);
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
    <AnimatePresence>
      {open && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-0 left-0 w-screen h-screen bg-black/50"
          ></motion.div>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-0 left-0 w-screen h-screen bg-primary"
          >
            {import.meta.env.MODE === "development" && (
              <div
                onClick={handleClose}
                className="top-5 left-5 absolute bg-link/10 rounded-2xl px-2 py-1 text-link z-50"
              >
                Back
              </div>
            )}
            <TelegramWallpaper />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
