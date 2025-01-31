import { useEffect, useRef, useState } from "react";
import { Button } from "@telegram-apps/telegram-ui";
import connectionIcon from "@/assets/icons/connection-icon.svg";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";

import { ManageDialogsModal } from "./(modals)/-manage-dialogs-modal";

export const Pencil = () => {
  const [showToolTip, setShowToolTip] = useState(false);
  const [showManageDialogsModal, setShowManageDialogsModal] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowToolTip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="fixed bottom-24 right-6">
        <div
          className={`h-screen w-screen fixed top-0 left-0 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        ></div>
        <div
          ref={tooltipRef}
          className={`p-2 absolute w-48 right-0 bottom-16 bg-primary border-primary border-[1px] rounded-xl transition-opacity ease-in-out duration-150 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"} shadow-lg space-y-2`}
        >
          <div className="h-[2px] bg-divider"></div>
          <ToolTipItem
            icon={connectionIcon}
            title={`New topic`}
            action={() => {
              setShowManageDialogsModal(true);
              setShowToolTip(false);
            }}
          />
        </div>
        <Button
          size={"s"}
          className={"rounded-full"}
          style={{ borderRadius: "50% !important" }}
          onClick={() => setShowManageDialogsModal(true)}
        >
          <div className="text-white h-6 w-6">
            <PencilIcon />
          </div>
        </Button>
      </div>
      <ManageDialogsModal
        isOpen={showManageDialogsModal}
        close={() => setShowManageDialogsModal(false)}
      />
    </div>
  );
};

const ToolTipItem = ({
  icon,
  title,
  action,
}: {
  icon: string;
  title: string;
  action: () => void;
}) => {
  return (
    <Button mode={"plain"} stretched={true} onClick={action}>
      <div className="flex w-full">
        <img src={icon} className="h-6 w-6" alt="" />
        <div className="ml-4 text-left font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </Button>
  );
};
