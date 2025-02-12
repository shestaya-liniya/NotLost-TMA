import { jazzRemoveDialog } from "@/lib/jazz/actions/jazz-dialog";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { JazzDialog, JazzFolder } from "@/lib/jazz/schema";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import MoreIcon from "@/assets/icons/more.svg?react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import Tappable from "../Tappable";
import { useModalStore } from "@/lib/store/modal-store";

export const DialogTooltip = ({
  dialog,
  folder,
  showTooltip,
  closeTooltip,
}: {
  dialog: JazzDialog;
  folder: JazzFolder;
  showTooltip: boolean;
  closeTooltip: () => void;
}) => {
  const { jazzProfile } = useJazzProfileContext();
  const { setDialogInfoModalOpen, setDialogInfoModalDialog } =
    useModalStore();

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (showTooltip) {
        event.preventDefault();
        closeTooltip();
      }
    };

    if (showTooltip) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [showTooltip, closeTooltip]);

  const navigateToDialogInfo = () => {
    setDialogInfoModalDialog(dialog);
    setDialogInfoModalOpen(true);
  };

  const removeDialog = () => {
    if (jazzProfile) {
      jazzRemoveDialog(jazzProfile, dialog, folder);
    }
  };

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`absolute left-1 -top-full -translate-x-1/4 backdrop-blur-lg bg-primary bg-opacity-70 border-link/10 border-[2px] rounded-xl shadow-lg z-30`}
          onTouchStart={(event) => {
            event.stopPropagation();
          }}
        >
          <DialogToolTipItem
            Icon={
              <div className="text-link h-4 w-4">
                <MoreIcon />
              </div>
            }
            title={"Info"}
            action={() => {
              navigateToDialogInfo();
            }}
            closeTooltip={closeTooltip}
          />
          <div className="h-[2px] bg-link/10"></div>
          <DialogToolTipItem
            Icon={
              <div className="text-link">
                <RemoveIcon className="text-link w-4 h-4" />
              </div>
            }
            title={"Remove"}
            action={() => {
              removeDialog();
            }}
            closeTooltip={closeTooltip}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DialogToolTipItem = ({
  Icon,
  title,
  action,
  closeTooltip,
}: {
  Icon: React.ReactElement;
  title: string;
  action: () => void;
  closeTooltip: () => void;
}) => {
  return (
    <Tappable
      className=" p-2"
      onClick={() => {
        action();
        closeTooltip();
      }}
    >
      <div className="flex w-full items-center">
        {Icon}
        <div className="ml-2 text-left font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </Tappable>
  );
};
