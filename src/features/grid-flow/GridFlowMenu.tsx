import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { createPortal } from "react-dom";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tappable from "@/ui/Tappable";

export default function GridFlowMenu(props: {
  show: boolean;
  setShow: (val: boolean) => void;
}) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {props.show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute top-0 left-0 h-screen w-screen"
            onClick={() => props.setShow(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Menu */}
          <motion.div
            style={{
              top: getMiniAppTopInset() + 32,
              boxShadow:
                "rgba(0, 0, 0, 0.3) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 2px 16px 0px",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 bg-[#141414] rounded-xl border-[1px] border-[#252525]"
          >
            <MenuItem>
              <GrabIcon className="w-5 h-5" />
              <div>Move</div>
            </MenuItem>
            <Divider />
            <MenuItem>
              <GrabIcon className="w-5 h-5" />
              <div>Add</div>
            </MenuItem>
            <Divider />
            <MenuItem>
              <GrabIcon className="w-5 h-5" />
              <div>Home</div>
            </MenuItem>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

const MenuItem = ({ children }: { children: ReactNode }) => {
  return (
    <Tappable className="px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 transition-colors">
      {children}
    </Tappable>
  );
};

const Divider = () => <div className="bg-[#252525] h-[1px] w-full" />;
