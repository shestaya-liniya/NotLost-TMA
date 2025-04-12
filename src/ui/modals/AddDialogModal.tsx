import { useModalStore } from "@/lib/store/modalStore";
import Input from "@/ui/Input";
import Modal from "@/ui/modals/Modal";
import { useState, useEffect } from "react";
import Settings from "@/assets/icons/settings.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { jazzAddDialogToFolder } from "@/lib/jazz/actions/jazzFolder";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import Button from "@/ui/Button";
import TelegramIcon from "@/assets/icons/telegram.svg?react";
import Tappable from "../Tappable";
import { useAppStore } from "@/lib/store/store";
import SearchIcon from "@/assets/icons/search.svg?react";
import { getTelegramSession } from "@/helpers/telegram/telegramSession";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import DialogsSlider from "../dialog/DialogsSlider";
import getTelegramAvatarLink, {
  checkUserExist,
} from "@/helpers/telegram/getTelegramAvatarLink";

export default function AddDialogModal() {
  const {
    addDialogModalOpen,
    setAddDialogModalOpen,
    addDialogModalFolder,
    setTelegramSignInModalOpen,
  } = useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const [usernameValue, setUsernameValue] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const RESULT_BLOCK_HEIGHT = 56;
  // Debounced username value
  useEffect(() => {
    if (!usernameValue) {
      setIsValidUsername(false);
      return;
    }

    const handler = setTimeout(() => {
      setIsLoading(true);
      checkUserExist(usernameValue).then((res) => {
        if (res.exists) {
          setIsValidUsername(true);
        } else {
          setIsValidUsername(false);
        }
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [usernameValue]);

  const handleAddDialogIntoFolder = () => {
    if (addDialogModalFolder && isValidUsername) {
      jazzAddDialogToFolder(jazzProfile, addDialogModalFolder, {
        name: usernameValue,
        username: usernameValue,
      });
      setIsValidUsername(false);
      setUsernameValue("");
    }
  };

  if (getTelegramSession()) {
    return <WithTelegramSync />;
  }

  return (
    <Modal
      isOpen={addDialogModalOpen}
      onClose={() => {
        setAddDialogModalOpen(false);
      }}
      title="Add dialog"
    >
      <div className="flex gap-2">
        <Input
          label="username"
          value={usernameValue}
          onInput={(val) => {
            setIsValidUsername(false);
            setUsernameValue(val);
          }}
          before={<div className="text-hint">@</div>}
          className="bg-secondary"
        />

        <Tappable
          className="flex items-center justify-center text-link bg-link/10 rounded-xl px-2 gap-2 font-semibold"
          onClick={() => {
            setAddDialogModalOpen(false);
            setTelegramSignInModalOpen(true);
          }}
        >
          <TelegramIcon className="h-5 w-5" />
          Sync
        </Tappable>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            style={{
              height: RESULT_BLOCK_HEIGHT,
            }}
            className="mt-4 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="h-6 w-6 text-link animate-spin" />
          </motion.div>
        )}

        {!isLoading && isValidUsername && (
          <motion.div
            key="entity"
            className="flex mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <img
              style={{
                height: RESULT_BLOCK_HEIGHT,
              }}
              loading="lazy"
              src={getTelegramAvatarLink(usernameValue)}
              className="min-w-14 rounded-full"
              decoding="async"
              alt=""
            />
            <div className="flex-col items-start ml-4">
              <div className="text-link">@{usernameValue}</div>
              <div className="text-xs text-hint">
                Sync with Telegram to quickly add from your chats
              </div>
            </div>
            <div className="ml-auto">
              <Button title="Add" onClick={handleAddDialogIntoFolder} />
            </div>
          </motion.div>
        )}

        {!isLoading && !isValidUsername && usernameValue && (
          <motion.div
            key="not-found"
            style={{
              height: RESULT_BLOCK_HEIGHT,
            }}
            className="mt-4 flex items-center justify-center text-link bg-link/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            Nothing found
          </motion.div>
        )}
        {!isLoading && !isValidUsername && !usernameValue && (
          <motion.div
            key="not-found"
            style={{
              height: RESULT_BLOCK_HEIGHT,
            }}
            className="mt-4 flex items-center justify-center text-link bg-link/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            Find channel, bot or user
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-4"></div>
    </Modal>
  );
}

const WithTelegramSync = () => {
  const { addDialogModalOpen, setAddDialogModalOpen, addDialogModalFolder } =
    useModalStore();

  const { telegramDialogs } = useAppStore();
  const { jazzProfile } = useJazzProfileContext();

  const [searchValue, setSearchValue] = useState("");

  const [selectedChats, setSelectedChats] = useState<TelegramDialogInfo[]>([]);

  const filteredDialogs = telegramDialogs.filter(
    (d) =>
      d.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddChatsIntoFolder = () => {
    if (selectedChats.length > 0 && addDialogModalFolder) {
      selectedChats.forEach((chat) => {
        jazzAddDialogToFolder(jazzProfile, addDialogModalFolder, {
          name: chat.label,
          username: chat.username,
        });
      });

      setAddDialogModalOpen(false);
      setSelectedChats([]);
    }
  };

  return (
    <Modal
      isOpen={addDialogModalOpen}
      onClose={() => {
        setAddDialogModalOpen(false);
        setSelectedChats([]);
      }}
      title="Add dialog"
    >
      <div className="flex gap-2">
        <Input
          label="Search"
          value={searchValue}
          onInput={setSearchValue}
          className="bg-secondary"
          before={<SearchIcon className="h-4 w-4 opacity-50" />}
        />
      </div>
      {filteredDialogs.length > 0 ? (
        <div className="dialogs-swiper">
          <DialogsSlider
            dialogs={filteredDialogs}
            selectedDialogs={selectedChats}
            setSelectedDialogs={setSelectedChats}
            direction="vertical"
          />
        </div>
      ) : (
        <div className="text-center text-link p-4 font-semibold">
          Nobody found
        </div>
      )}

      {selectedChats.length > 0 ? (
        <Tappable
          className="h-12 flex items-center justify-center text-white bg-link
      rounded-xl mb-4 font-semibold"
          onClick={handleAddChatsIntoFolder}
        >
          Add {selectedChats.length} chats
        </Tappable>
      ) : (
        <div
          className="h-12 flex items-center justify-center text-link bg-link/10
      rounded-xl mb-4"
        >
          Select chats
        </div>
      )}
    </Modal>
  );
};
