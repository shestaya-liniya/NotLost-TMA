import BottomModal from "@/ui/modals/BottomModal.js";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Draggable from "@/ui/Draggable";
import { useModalStore } from "@/lib/store/modalStore";

export default function ManageDialogsModal() {
  const { manageDialogsModalOpen, setManageDialogsModalOpen } = useModalStore();
  return (
    <BottomModal
      id="manage-dialogs-modal"
      title="Edit folders"
      isOpen={manageDialogsModalOpen}
      onClose={() => setManageDialogsModalOpen(false)}
    >
      <div className="flex items-center text-link justify-center mb-6">
        <div className="absolute bg-secondary px-2 py-1 rounded-2xl -z-10 h-10 w-[180px] bg-opacity-30" />
        <Draggable draggableItem={null}>
          <div className="flex items-center bg-link/20 px-2 py-1 rounded-xl gap-2 font-medium touch-none no-select">
            <div className="h-6 w-6">
              <FolderIcon />
            </div>
            <div>Place new folder</div>
          </div>
        </Draggable>
      </div>
    </BottomModal>
  );
}

/* const trialContacts = [
  { username: "shestaya_liniya", label: "Andrei", unreadCount: 0 },
  { username: "skywl_k", label: "Andrei", unreadCount: 0 },
  { username: "PiraJoke", label: "Max", unreadCount: 0 },
  { username: "devs_cis", label: "Devs CIS", unreadCount: 0 },
  { username: "tmabuild", label: "TMA Build", unreadCount: 0 },
  { username: "toncoin_rus", label: "Toncoin Rus", unreadCount: 0 },
  { username: "contests", label: "Contests", unreadCount: 0 },
  { username: "tapps_bot", label: "Tapps", unreadCount: 0 },
  { username: "tapps_bot", label: "Tapps", unreadCount: 0 },
  { username: "tapps_bot", label: "Tapps", unreadCount: 0 },
  { username: "tapps_bot", label: "Tapps", unreadCount: 0 },
]; */
