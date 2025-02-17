import {
  $getTelegramEntityByUsername,
  ApiTelegramChannel,
  ApiTelegramUser,
} from "@/actions/telegram";
import { truncateWord } from "@/helpers/truncate-word";
import { useModalStore } from "@/lib/store/modal-store";
import Input from "@/ui/Input";
import Modal from "@/ui/modals/Modal";
import { useState, useEffect } from "react";
import Settings from "@/assets/icons/settings.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { jazzAddDialogToFolder } from "@/lib/jazz/actions/jazz-folder";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import Button from "@/ui/Button";

export default function AddDialogModal() {
  const { addDialogModalOpen, setAddDialogModalOpen, addDialogModalFolder } =
    useModalStore();
  const { jazzProfile } = useJazzProfileContext();

  const [usernameValue, setUsernameValue] = useState("");
  const [entity, setEntity] = useState<
    ApiTelegramUser | ApiTelegramChannel | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced username value
  useEffect(() => {
    if (!usernameValue) {
      setEntity(null);
      return;
    }

    const handler = setTimeout(() => {
      setIsLoading(true);
      $getTelegramEntityByUsername(usernameValue).then((res) => {
        setIsLoading(false);
        setEntity(res);
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [usernameValue]);

  const handleAddDialogIntoFolder = () => {
    if (addDialogModalFolder && entity) {
      jazzAddDialogToFolder(jazzProfile, addDialogModalFolder, {
        name:
          entity?.type === "Channel" ? entity.title : entity.firstName || "X",
        username: entity.username,
      });
      setEntity(null);
      setUsernameValue("");
    }
  };

  return (
    <Modal
      isOpen={addDialogModalOpen}
      onClose={() => setAddDialogModalOpen(false)}
      title="Add dialog"
    >
      <Input
        label="username"
        value={usernameValue}
        onInput={setUsernameValue}
        before={<div className="text-hint">@</div>}
        className="bg-secondary"
      />
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            className="h-12 mt-4 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="h-6 w-6 text-link animate-spin" />
          </motion.div>
        )}

        {!isLoading && entity && (
          <motion.div
            key="entity"
            className="flex mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <img
              loading="lazy"
              src={`https://t.me/i/userpic/320/${entity.username}.svg`}
              className="h-12 w-12 rounded-full border-1 border-link"
              decoding="async"
              alt=""
            />
            <div className="flex flex-col ml-4">
              <div className="text-sm font-medium">
                {truncateWord(
                  entity.type === "User"
                    ? entity.firstName || "No firstname"
                    : entity.title,
                  20
                )}
              </div>
              <div className="text-xs text-link">@{entity.username}</div>
            </div>
            <div className="ml-auto">
              <Button title="Add" onClick={handleAddDialogIntoFolder} />
            </div>
          </motion.div>
        )}

        {!isLoading && !entity && usernameValue && (
          <motion.div
            key="not-found"
            className="h-12 mt-4 flex items-center justify-center text-link bg-link/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            Nothing found
          </motion.div>
        )}
        {!isLoading && !entity && !usernameValue && (
          <motion.div
            key="not-found"
            className="h-12 mt-4 flex items-center justify-center text-link bg-link/10 rounded-xl"
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
