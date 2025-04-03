import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Tappable from "../Tappable";

export default function FolderAccordionTooltip(props: {
  children: React.ReactElement;
  isVisible: boolean;
  handleClose: () => void;
  position: { top: number; left: number } | null;
}) {
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (props.isVisible) {
        event.preventDefault();
        props.handleClose();
      }
    };

    if (props.isVisible) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [props.isVisible]);

  if (!props.position) return;

  return (
    <AnimatePresence>
      {props.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`absolute -translate-x-1/4 backdrop-blur-lg bg-primary bg-opacity-70 border-link/10 border-[2px] rounded-xl shadow-lg z-30`}
          onTouchStart={(event) => {
            event.stopPropagation();
          }}
          style={{
            top: `${props.position.top}px`,
            left: `${props.position.left}px`,
          }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const FolderAccordionToolTipItem = (props: {
  Icon: React.ReactElement;
  title: React.ReactElement;
  action: () => void;
  closeTooltip: () => void;
}) => {
  return (
    <Tappable
      className=" p-2"
      onClick={() => {
        props.action();
        props.closeTooltip();
      }}
    >
      <div className="flex w-full items-center">
        {props.Icon}
        <div className="ml-2 text-left font-medium text-sm whitespace-nowrap">
          {props.title}
        </div>
      </div>
    </Tappable>
  );
};
