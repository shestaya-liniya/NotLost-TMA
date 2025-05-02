import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { truncateWord } from "@/helpers/truncateWord";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useModalStore } from "@/lib/store/modalStore";
import { useAppStore } from "@/lib/store/store";
import Tappable from "@/ui/Tappable";
import VerticalScrollableList from "@/ui/VerticalScrollableList";
import { GridFlowNode } from "../GridFlowInterface";
import { gridFlowAddNode, gridFlowDeleteNode } from "../GridFlowUtils";
import { memo, useMemo } from "react";
import PinIcon from "@/assets/icons/pin.svg?react";
import { AnimatePresence, motion } from "framer-motion";
import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";

function Chats(props: {
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;
  const { jazzProfile } = useJazzProfileContext();
  const { telegramDialogs } = useAppStore();
  const { setTelegramSignInModalOpen } = useModalStore();

  const pinToWorkspace = (telegramChat: TelegramDialogInfo) => {
    gridFlowAddNode(
      {
        type: "chat",
        data: {
          username: telegramChat.username,
          name: telegramChat.label,
        },
      },
      nodes,
      setNodes
    );
  };

  const unpinFromWorkspace = (node: GridFlowNode) => {
    gridFlowDeleteNode(node.id, setNodes);
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, GridFlowNode>();
    nodes.forEach((n) => {
      if (n.data.username) map.set(n.data.username, n);
    });
    return map;
  }, [nodes]);

  return (
    <div>
      {jazzProfile.telegramSync ? (
        <VerticalScrollableList className="gap-8 max-h-72">
          {telegramDialogs.map((telegramChat) => {
            const chatFromWorkspace = nodeMap.get(telegramChat.username);
            return (
              <ChatBubble
                key={telegramChat.username}
                telegramChat={telegramChat}
                pinned={chatFromWorkspace !== undefined}
                pinToWorkspace={() => pinToWorkspace(telegramChat)}
                unpinFromWorkspace={() => {
                  if (chatFromWorkspace !== undefined) {
                    unpinFromWorkspace(chatFromWorkspace);
                  }
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
  unpinFromWorkspace?: () => void;
}) => {
  const { telegramChat } = props;

  return (
    <Tappable
      className="flex flex-col items-center max-w-12 relative"
      onClick={() => {
        if (props.pinned) {
          props.unpinFromWorkspace?.();
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

export default memo(Chats);
