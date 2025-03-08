import BottomModal from "@/ui/modals/BottomModal.js";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Dialog from "@/ui/dialog/Dialog.js";
import Draggable from "@/ui/Draggable";
import { useModalStore } from "@/lib/store/modal-store";
import { useEffect, useState } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import Tappable from "../Tappable";
import { $getMyDialogs } from "@/actions/telegram";
import { qrScanner } from "@telegram-apps/sdk-react";
import Button from "../Button";

interface DialogInfo {
  label: string;
  username: string;
}

export default function ManageDialogsModal() {
  const { manageDialogsModalOpen, setManageDialogsModalOpen } = useModalStore();
  const [dialogsSlice, setDialogsSlice] = useState(8);
  const [dialogs, setDialogs] = useState<DialogInfo[]>([]);

  useEffect(() => {
    $getMyDialogs().then((dialogs) => {
      dialogs.forEach((d) => {
        if (d.entity?.className === "User") {
          if (!d.entity.username) return;
          const userInfo = {
            label: d.entity.firstName || "X",
            username: d.entity.username || "X",
          };
          setDialogs((prev) => [...prev, userInfo]);
        } else if (d.entity?.className === "Channel") {
          if (!d.entity.username) return;
          const userInfo = {
            label: d.entity.title || "X",
            username: d.entity.username || "X",
          };
          setDialogs((prev) => [...prev, userInfo]);
        }
      });
    });
  }, []);

  useEffect(() => {
    console.log(dialogsSlice);
  }, [dialogsSlice]);

  const openQr = () => {
    if (qrScanner.open.isAvailable()) {
      qrScanner.isOpened(); // false
      qrScanner.open({
        text: "Scan the QR",
        //@ts-ignore
        onCaptured(qr) {
          if (qr === "qr-content-we-expect") {
            qrScanner.close();
          }
        },
      });
    }
  };

  return (
    <BottomModal
      id="manage-dialogs-modal"
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
      <div className="flex flex-wrap gap-2 justify-center relative">
        {trialContacts.slice(dialogsSlice - 8, dialogsSlice).map((d) => (
          <div className="relative animate-fadeIn" key={d.username}>
            <div className="">
              <Draggable
                draggableItemType="contact"
                draggableItem={{
                  name: d.label,
                  username: d.username,
                }}
              >
                <Dialog name={d.label} username={d.username} />
              </Draggable>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-12 w-12 bg-secondary rounded-full -z-10 animate-pulse" />
          </div>
        ))}
        <div className="absolute -right-4 top-0 h-full flex items-center">
          <Tappable
            className="px-1 py-6 rounded-full bg-link/20"
            onClick={() => {
              setDialogsSlice((prev) => {
                if (prev !== dialogs.length) {
                  return prev + 8;
                }
                return dialogs.length;
              });
            }}
          >
            <ChevronIcon className="h-4 w-4 text-link" />
          </Tappable>
        </div>
        <div className="absolute -left-4 top-0 h-full flex items-center">
          <Tappable
            className="px-1 py-6 rounded-full bg-link/20"
            onClick={() => {
              if (dialogsSlice !== 8) {
                setDialogsSlice((prev) => {
                  return prev - 8;
                });
              }
            }}
          >
            <ChevronIcon className="h-4 w-4 text-link rotate-180" />
          </Tappable>
        </div>
      </div>
      <Button title="qr" onClick={openQr} />
    </BottomModal>
  );
}

const trialContacts = [
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
];
