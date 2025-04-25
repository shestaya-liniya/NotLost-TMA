import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { createPortal } from "react-dom";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tappable from "@/ui/Tappable";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { usePinDeskStore } from "./PinDeskStore";

export default function GridFlowMenu(props: {
  show: boolean;
  setShow: (val: boolean) => void;
}) {
  const { nodesDraggable, setNodesDraggable } = usePinDeskStore();

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {props.show && (
        <>
          {/* Backdrop */}
          <div
            onPointerDown={() => props.setShow(false)}
            className="absolute top-0 left-0 h-screen w-screen"
          />

          {/* Menu */}
          <motion.div
            style={{
              top: getMiniAppTopInset() + 10,
              boxShadow:
                "rgba(0, 0, 0, 0.3) 0px 2px 4px 0px, rgba(0, 0, 0, 0.3) 0px 2px 16px 0px",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 left-1/2 -translate-x-1/2 bg-button rounded-xl border-[1px] border-secondary overflow-hidden"
          >
            <MenuItem
              active={nodesDraggable}
              action={() => setNodesDraggable(!nodesDraggable)}
            >
              <GrabIcon className="w-5 h-5" />
              <div>Move</div>
            </MenuItem>
            <Divider />
            <MenuItem>
              <PlusIcon className="w-5 h-5" />
              <div>Add</div>
            </MenuItem>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

const MenuItem = (props: {
  children: ReactNode;
  active?: boolean;
  action?: () => void;
}) => {
  return (
    <Tappable
      onClick={props.action}
      className={`px-3 py-1.5 flex items-center gap-2 ${props.active ? "text-black bg-white" : ""}`}
    >
      {props.children}
    </Tappable>
  );
};

const Divider = () => <div className="bg-secondary h-[1px] w-full" />;
