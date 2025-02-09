import BottomModal from "@/ui/BottomModal.jsx";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Dialog from "@/ui/Dialog.jsx";
import Draggable from "@/ui/Draggable";
import { useModalStore } from "@/lib/store/modal-store";

export default function ManageDialogsModal() {
  const { manageDialogsModalOpen, setManageDialogsModalOpen } = useModalStore();

  return (
    <BottomModal
      title="Manage dialogs"
      isOpen={manageDialogsModalOpen}
      onClose={() => setManageDialogsModalOpen(false)}
    >
      <div className="flex items-center text-link justify-center mb-6">
        <div className="absolute bg-secondary px-2 py-1 rounded-2xl -z-10 h-10 w-[180px] bg-opacity-30" />
        <Draggable draggableItemType="folder" draggableItem={null}>
          <div className="flex items-center bg-link/20 px-2 py-1 rounded-xl gap-2 font-medium touch-none no-select">
            <div className="h-6 w-6">
              <FolderIcon />
            </div>
            <div>Place new folder</div>
          </div>
        </Draggable>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {trialContacts.map((contact) => (
          <div className="relative" key={contact.username}>
            <div className="">
              <Draggable
                draggableItemType="contact"
                draggableItem={{
                  name: contact.name,
                  username: contact.username,
                }}
              >
                <Dialog name={contact.name} username={contact.username} />
              </Draggable>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-12 w-12 bg-secondary rounded-full -z-10 animate-pulse" />
          </div>
        ))}
      </div>
    </BottomModal>
  );
}

const trialContacts = [
  { username: "shestaya_liniya", name: "Andrei", unreadCount: 0 },
  { username: "skywl_k", name: "Andrei", unreadCount: 0 },
  { username: "PiraJoke", name: "Max", unreadCount: 0 },
];
