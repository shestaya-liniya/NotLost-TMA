import Tappable from "@/ui/Tappable";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function TooltipModal(props: {
  children: React.ReactNode;
  isVisible: boolean;
  handleClose: () => void;
  position: { x: number; y: number } | null;
  side?: "left" | "right";
}) {
  if (!props.position) return;

  return createPortal(
    <AnimatePresence>
      {props.isVisible && (
        <div>
          <div
            className="absolute top-0 left-0 w-screen h-screen"
            onClick={() => {
              props.handleClose();
            }}
          ></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-20 ${props.side === "left" && "-translate-x-full"} rounded-xl overflow-hidden bg-secondary/50 backdrop-blur-sm`}
            onClick={(event) => {
              event.stopPropagation();
            }}
            style={{
              top: `${props.position.x}px`,
              left: `${props.position.y}px`,
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 2px 16px 0px",
            }}
          >
            {props.children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export const TooltipItem = (props: {
  Icon: React.ReactElement;
  title: React.ReactElement;
  action: () => void;
  closeTooltip: () => void;
}) => {
  return (
    <Tappable
      onClick={() => {
        props.action();
        props.closeTooltip();
      }}
    >
      <div className="px-4 py-2 w-full flex items-center justify-between text-[15px] gap-3">
        <div className="">{props.title}</div>
        <div>{props.Icon}</div>
      </div>
    </Tappable>
  );
};
