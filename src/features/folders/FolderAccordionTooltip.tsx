import Tappable from "@/ui/Tappable";
import { AnimatePresence, motion } from "framer-motion";

export default function FolderAccordionTooltip(props: {
  children: React.ReactElement;
  isVisible: boolean;
  handleClose: () => void;
  position: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  } | null;
}) {
  if (!props.position) return;

  return (
    <AnimatePresence>
      {props.isVisible && (
        <div>
          <div
            className="fixed top-0 left-0 w-screen h-screen z-20"
            onClick={props.handleClose}
          />
          <motion.div
            initial={{
              opacity: 0,
              transform: "translateX(10px) scale(0.8)",
            }}
            animate={{
              opacity: 1,
              transform: "translateX(0px) scale(1)",
            }}
            exit={{
              opacity: 0,
              transform: "translateX(0px) scale(1)",
            }}
            transition={{ duration: 0.1 }}
            className={`absolute -translate-x-1/4 backdrop-blur-lg bg-secondary bg-opacity-70 rounded-xl shadow-lg z-30 flex`}
            onTouchStart={(event) => {
              event.stopPropagation();
            }}
            style={{
              top: props.position.top,
              left: props.position.left,
              bottom: props.position.bottom,
              right: props.position.right,
            }}
          >
            <div className="bg-primary rounded-md">{props.children}</div>
          </motion.div>
        </div>
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
        <div className="ml-2 text-left font-semibold text-sm whitespace-nowrap">
          {props.title}
        </div>
      </div>
    </Tappable>
  );
};
