import BottomModal from "@/ui/BottomModal.jsx";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Dialog from "@/ui/Dialog.jsx";
import { useRef } from "react";

interface ManageDialogsModal {
  isOpen: boolean;
  close: () => void;
}

export default function ManageDialogsModal(props: ManageDialogsModal) {
  return (
    <BottomModal
      title="Manage dialogs"
      isOpen={props.isOpen}
      onClose={() => props.close()}
    >
      <div className="flex items-center text-link justify-center mb-6">
        <div className="absolute bg-secondary px-2 py-1 rounded-2xl -z-10 h-10 w-[180px] bg-opacity-30" />
        <DraggableBlock>
          <div className="flex items-center bg-link/20 px-2 py-1 rounded-xl gap-2 font-medium touch-none no-select">
            <div className="h-6 w-6">
              <FolderIcon />
            </div>
            <div>Place new folder</div>
          </div>
        </DraggableBlock>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {trialContacts.map((contact) => (
          <div className="relative" key={contact.username}>
            <div className="">
              <DraggableBlock>
                <Dialog name={contact.name} username={contact.username} />
              </DraggableBlock>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-12 w-12 bg-secondary rounded-full -z-10 animate-pulse" />
          </div>
        ))}
      </div>
    </BottomModal>
  );
}

const DraggableBlock = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    let touch = e.touches[0];

    if (!ref.current) {
      return;
    }

    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      ref.current!.style.transition = "";

      touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      const dy = touch.clientY - startPos.y;

      ref.current!.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const handleTouchEnd = () => {
      ref.current!.style.transition = `transform 0.3s ease`;
      ref.current!.style.transform = `translate(0px, 0px)`;
      document.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      document.removeEventListener("touchend", handleTouchEnd);
    };
    document.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener
    );
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={ref}
      className="relative touch-none"
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};

const trialContacts = [
  { username: "shestaya_liniya", name: "Andrei", unreadCount: 0 },
  { username: "skywl_k", name: "Andrei", unreadCount: 0 },
  { username: "PiraJoke", name: "Max", unreadCount: 0 },
];
