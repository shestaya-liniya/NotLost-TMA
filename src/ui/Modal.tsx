import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useKeyboardState } from "@/helpers/use-keyboard-visible";
import useViewportSize from "@/helpers/use-viewport-height";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = (props: ModalProps) => {
  const viewportSize = useViewportSize();
  const keyboardState = useKeyboardState();

  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (keyboardState) {
      if (localStorage.getItem("viewport-with-opened-keyboard")) {
        setHeight(
          parseInt(localStorage.getItem("viewport-with-opened-keyboard") ?? "0")
        );
      } else {
        setHeight(viewportSize?.[1] ?? 0);
      }
    } else {
      setHeight(null);
    }
  }, [keyboardState]);

  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`absolute top-0 left-0 w-full z-50 transition-height duration-300 ease-in-out bg-black/30`}
            style={{
              height: height ? height : "100dvh",
            }}
            onClick={props.onClose}
          >
            <div
              id={props.id}
              className={`bg-primary pointer-events-auto pt-6 pl-6 pr-6 pb-2 rounded-2xl shadow-lg transition-all ease-in-out absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] duration-300 ${
                props.isOpen
                  ? "animate-slideUp  "
                  : "translate-y-full animate-slideDown"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-2xl font-semibold text-center mb-4">
                {props.title}
              </div>
              {props.children}
              <div
                className="absolute top-2 right-2 text-xl font-semibold text-link rounded-full bg-link/20 p-2"
                onClick={() => props.onClose()}
              >
                <RemoveIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
