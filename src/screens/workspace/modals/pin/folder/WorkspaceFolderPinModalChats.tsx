import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { truncateWord } from "@/helpers/truncateWord";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useModalStore } from "@/lib/store/modalStore";
import { useAppStore } from "@/lib/store/store";
import Tappable from "@/ui/Tappable";
import VerticalScrollableList from "@/ui/VerticalScrollableList";
import { memo } from "react";
import PinIcon from "@/assets/icons/pin.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import {
  JazzListOfWorkspaceFolderChats,
  JazzWorkspaceFolderChat,
} from "@/lib/jazz/schema";
import {
  useWorkspaceActions,
  useWorkspaceStore,
} from "@/screens/workspace/.store/Workspace.store";

function WorkspaceFolderPinModalChats() {
  const { jazzProfile } = useJazzProfileContext();
  const openedFolder = useWorkspaceStore((s) => s.openedFolder);
  const { setOpenedFolder } = useWorkspaceActions();

  const telegramDialogs = useAppStore((s) => s.telegramDialogs);
  const setTelegramSignInModalOpen = useModalStore(
    (s) => s.setTelegramSignInModalOpen
  );

  const addToFolder = (telegramChat: TelegramDialogInfo) => {
    if (openedFolder && openedFolder.chats) {
      openedFolder.chats.push(
        JazzWorkspaceFolderChat.create({
          label: telegramChat.label,
          username: telegramChat.username,
        })
      );
      setOpenedFolder(openedFolder);
    }
  };

  const removeFromFolder = (username: string) => {
    if (openedFolder && openedFolder.chats) {
      const filteredChats = openedFolder?.chats?.filter(
        (c) => c?.username !== username
      );
      openedFolder.chats = JazzListOfWorkspaceFolderChats.create(filteredChats);
      setOpenedFolder(openedFolder);
    }
  };

  const pinned = (username: string) => {
    const existantChat = openedFolder?.chats?.find(
      (c) => c?.username === username
    );
    return existantChat !== undefined;
  };

  return (
    <div>
      {jazzProfile.telegramSync ? (
        <VerticalScrollableList className="gap-8 max-h-72">
          {telegramDialogs.map((telegramChat) => {
            return (
              <ChatBubble
                key={telegramChat.username}
                telegramChat={telegramChat}
                pinned={pinned(telegramChat.username)}
                pinToWorkspace={() => addToFolder(telegramChat)}
                unpinFromWorkspace={(username: string) => {
                  removeFromFolder(username);
                }}
              />
            );
          })}
        </VerticalScrollableList>
      ) : (
        <Tappable
          onTap={() => setTelegramSignInModalOpen(true)}
          className="px-2 rounded-full py-1 bg-secondary"
        >
          Go to sync
        </Tappable>
      )}
    </div>
  );
}

const ChatBubble = (props: {
  telegramChat: TelegramDialogInfo;
  pinned: boolean;
  pinToWorkspace: () => void;
  unpinFromWorkspace?: (username: string) => void;
}) => {
  const { telegramChat } = props;

  return (
    <Tappable
      className="flex flex-col items-center max-w-12 relative"
      onClick={() => {
        if (props.pinned) {
          props.unpinFromWorkspace?.(telegramChat.username);
        } else {
          props.pinToWorkspace();
        }
      }}
    >
      <img
        src={getTelegramAvatarLink(telegramChat.username)}
        className="h-12 min-w-12 rounded-full"
        alt=""
      />
      <div className="text-xs text-nowrap text-hint">
        {telegramChat.label.length > 10 ? (
          <div className="relative">
            {truncateWord(telegramChat.label, 10)}
            <div className="bg-gradient-to-r from-transparent to-primary h-full w-8 absolute right-0 top-0"></div>
          </div>
        ) : (
          telegramChat.label
        )}
      </div>
      <AnimatePresence>
        {props.pinned && (
          <motion.div
            key="pin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute -top-1 -right-1 p-1 h-5 w-5 rounded-full bg-secondary grid place-content-center">
              <PinIcon className="h-3 w-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Tappable>
  );
};

export default memo(WorkspaceFolderPinModalChats);
