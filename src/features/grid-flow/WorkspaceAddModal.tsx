import getTelegramAvatarLink from "@/helpers/telegram/getTelegramAvatarLink";
import { truncateWord } from "@/helpers/truncateWord";
import BottomModal from "@/ui/modals/BottomModal";
import Tappable from "@/ui/Tappable";
import VerticalScrollableList from "@/ui/VerticalScrollableList";
import { v4 } from "uuid";
import { GridFlowNode } from "./GridFlowInterface";
import { findFreeSpace } from "./GridFlowUtils";
import { useAppStore } from "@/lib/store/store";
import DuckIcon from "@/assets/icons/duck-rubber.svg?react";
import PinIcon from "@/assets/icons/pin.svg?react";
import { memo } from "react";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useModalStore } from "@/lib/store/modalStore";

function WorkspaceAddModal(props: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  nodes: GridFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>;
}) {
  const { jazzProfile } = useJazzProfileContext();
  const { nodes, setNodes } = props;
  const { telegramDialogs } = useAppStore();
  const { setTelegramSignInModalOpen } = useModalStore();

  if (!props.showModal) return;

  return (
    <BottomModal
      id="workspace-add-modal"
      isOpen={props.showModal}
      onClose={() => props.setShowModal(false)}
      title="New"
      className=""
    >
      <div>
        <div className="text-xs text-hint font-medium pl-2 pb-2">Blocks</div>
        <div className="relative">
          <Tappable
            onTap={() => {
              const freeSpace = findFreeSpace(nodes, 2, 4);
              if (freeSpace) {
                const newNodeId = v4();
                const newNode: GridFlowNode = {
                  id: newNodeId,
                  type: "folder",
                  data: {
                    username: "shestaya_liniya",
                    name: "Andrei",
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
            className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative overflow-hidden border-[1px] border-secondary"
          >
            <div className="text-xs font-medium mt-2 w-full absolute top-0 left-0 pb-1.5 px-4 text-white flex items-center gap-1">
              <div className="tracking-widest text-[10px] text-[#d4d4d4]">
                Folder
              </div>
            </div>
            <div className="flex relative mt-8 gap-1">
              <div className="h-8 w-8 rounded-full bg-secondary relative">
                <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary relative">
                <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary relative">
                <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
              </div>
            </div>
          </Tappable>
          <div className="text-xs text-hint font-medium pl-2 pb-2 mt-2">
            Chats
          </div>
          {jazzProfile.telegramSync ? (
            <VerticalScrollableList className="gap-8 max-h-56">
              {props.showModal &&
                telegramDialogs.map((dialog) => {
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
                          setNodes((nds) =>
                            nds.concat(newNode as GridFlowNode)
                          );

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
      </div>
    </BottomModal>
  );
}

export default memo(WorkspaceAddModal);
