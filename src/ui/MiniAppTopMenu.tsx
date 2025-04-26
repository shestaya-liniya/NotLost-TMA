import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { createPortal } from "react-dom";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tappable from "@/ui/Tappable";

export default function MiniAppTopMenu(props: {
  children: ReactNode;
  show: boolean;
  setShow: (val: boolean) => void;
}) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {props.show && (
        <>
          <div
            onPointerDown={() => props.setShow(false)}
            className="absolute top-0 left-0 h-screen w-screen"
          />

          <motion.div
            style={{
              top: getMiniAppTopInset() + 10,
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 2px 16px 0px",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 bg-[#232323]  backdrop-blur-xl rounded-xl overflow-hidden"
          >
            {props.children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export const MiniAppTopMenuItem = (props: {
  children: ReactNode;
  active?: boolean;
  action?: () => void;
}) => {
  return (
    <Tappable
      onTap={props.action}
      className={`px-4 py-2 w-full flex items-center justify-between text-[15px] font-light gap-3 ${props.active ? "text-black bg-white" : ""}`}
    >
      {props.children}
    </Tappable>
  );
};

export const MiniAppTopMenuDivider = () => (
  <div className="bg-[#363636] h-[1px] w-full" />
);
