import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { truncateWord } from "@/helpers/truncateWord";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useModalStore } from "@/lib/store/modalStore";
import { useAppStore } from "@/lib/store/store";
import Tappable from "@/ui/Tappable";
import VerticalScrollableList from "@/ui/VerticalScrollableList";
import { v4 } from "uuid";
import { GridFlowNode } from "../GridFlowInterface";
import { findFreeSpace } from "../GridFlowUtils";
import { memo } from "react";
import PinIcon from "@/assets/icons/pin.svg?react";

function Chats(props: {
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { nodes, setNodes } = props;
  const { jazzProfile } = useJazzProfileContext();
  const { telegramDialogs } = useAppStore();
  const { setTelegramSignInModalOpen } = useModalStore();

  return (
    <div>
      {jazzProfile.telegramSync ? (
        <VerticalScrollableList className="gap-8 max-h-72">
          {telegramDialogs.map((dialog) => {
            // need to add props.showModal cause of bug in drag nodes mode, fix later
            const existOnWorkspace = nodes.find(
              (n) => n.data.username === dialog.username
            );
            return (
              <Tappable
                className="flex flex-col items-center max-w-12 relative"
                key={v4()}
                onClick={() => {
                  if (existOnWorkspace) {
                    const filteredNodes = nodes.filter(
                      (n) => n.data.username !== dialog.username
                    );
                    setNodes(filteredNodes);
                    return;
                  }
                  const freeSpace = findFreeSpace(nodes, 2, 2);
                  if (freeSpace) {
                    const newNodeId = v4();
                    const newNode: GridFlowNode = {
                      id: newNodeId,
                      type: "chat",
                      data: {
                        username: dialog.username,
                        name: dialog.label,
                      },
                      position: freeSpace,
                      className: "animate-fadeIn",
                    };
                    setNodes((nds) => nds.concat(newNode as GridFlowNode));

                    setTimeout(() => {
                      setNodes((ns) =>
                        ns.map((n) => {
                          if (n.id === newNodeId) {
                            return { ...n, className: "" };
                          }
                          return n;
                        })
                      );
                    }, 300);
                  }
                }}
              >
                <img
                  src={getTelegramAvatarLink(dialog.username)}
                  className="h-12 min-w-12 rounded-full"
                  alt=""
                />
                <div className="text-xs text-nowrap text-hint">
                  {dialog.label.length > 10 ? (
                    <div className="relative">
                      {truncateWord(dialog.label, 10)}
                      <div className="bg-gradient-to-r from-transparent to-primary h-full w-8 absolute right-0 top-0"></div>
                    </div>
                  ) : (
                    dialog.label
                  )}
                </div>
                {existOnWorkspace && (
                  <div className="absolute -top-1 -right-1 p-1 h-5 w-5 rounded-full bg-secondary grid place-content-center">
                    <PinIcon className="h-3 w-3" />
                  </div>
                )}
              </Tappable>
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

export default memo(Chats);
