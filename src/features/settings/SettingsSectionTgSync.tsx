import { useTelegramSession } from "@/helpers/telegram/telegram-session";
import { useModalStore } from "@/lib/store/modal-store";
import Tappable from "../../ui/Tappable";
import SettingsOneLineSection from "./SettingsOneLineSection";
import TelegramIcon from "@/assets/icons/telegram.svg?react";

export default function SettingsSectionTgSync() {
  const { setTelegramSignInModalOpen, setSettingsModalOpen } = useModalStore();
  const { deleteSession, signedIn } = useTelegramSession();

  const handleLogout = () => {
    deleteSession();
  };
  return (
    <SettingsOneLineSection>
      <div className="flex gap-4 flex-1">
        <TelegramIcon className="w-6 h-6 text-link" />
        Telegram Sync
      </div>
      <div>
        {signedIn ? (
          <Tappable
            className="bg-link/10 rounded-xl px-4 py-1 text-link"
            onClick={handleLogout}
          >
            Log out
          </Tappable>
        ) : (
          <Tappable
            className="bg-link/10 rounded-xl px-4 py-1 text-link"
            onClick={() => {
              setSettingsModalOpen(false);
              setTimeout(() => {
                setTelegramSignInModalOpen(true);
              }, 300);
            }}
          >
            Sync
          </Tappable>
        )}
      </div>
    </SettingsOneLineSection>
  );
}
