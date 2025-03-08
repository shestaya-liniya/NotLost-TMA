import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import ChatIcon from "@/assets/icons/chat.svg?react";
import { useEffect, useState } from "react";
import { $getMyDialogs } from "@/actions/telegram";
import axios from "axios";
import Button from "@/ui/Button";
import SettingsIcon from "@/assets/icons/settings.svg?react";

interface LastUnreadMessage {
  fromUsername: string;
  message: string;
}

interface AiSummarizedChat {
  username: string;
  description: string;
}

interface ChatsSortedByPriority {
  "1": AiSummarizedChat[];
  "2": AiSummarizedChat[];
  "3": AiSummarizedChat[];
}

export default function Ai() {
  const lp = retrieveLaunchParams();

  const [unreadMessages, setUnreadMessages] = useState<LastUnreadMessage[]>([]);
  const [prioritizedChats, setPrioritizedChats] = useState<
    ChatsSortedByPriority | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unreadMessages.length < 1) {
      $getMyDialogs().then((dialogs) => {
        const unreadMessagesTemp: LastUnreadMessage[] = [];
        dialogs.forEach((d) => {
          if (d.entity?.className === "User") {
            if (!d.entity.username || d.unreadCount === 0) return;
            const unreadMessage = {
              fromUsername: d.entity.username || "X",
              message: d.message?.message || "X",
            };
            unreadMessagesTemp.push(unreadMessage);
          }
        });
        setUnreadMessages(unreadMessagesTemp);
      });
    }
  }, []);

  useEffect(() => {
    console.log("UNREAD MESSAGES", unreadMessages);
  }, [unreadMessages]);

  const getAiSummarization = async () => {
    setLoading(true);
    const answer = await axios.post(
      "http://localhost:4000/api/v1/open-ai-api",
      {
        prompt: JSON.stringify(unreadMessages),
      }
    );
    setLoading(false);
    setPrioritizedChats(answer.data);
  };

  return (
    <div
      className="h-full flex-col p-4"
      style={{
        paddingTop: ["macos", "tdesktop"].includes(lp.tgWebAppPlatform)
          ? 40
          : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
      }}
    >
      <div className="text-center text-link text-xl font-semibold">AI</div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 w-full font-semibold flex gap-4 mt-4`}
      >
        <ChatIcon className="w-6 h-6 text-link" />
        Unread chats
      </div>
      <div className="bg-secondary border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-primary/30 p-4 w-full flex flex-col justify-center items-center gap-4 flex-wrap">
        <div className="text-hint text-xs">
          You have <span className="text-link">{unreadMessages.length}</span>{" "}
          unread chats
        </div>
        <div>
          <Button title="Sort with AI" onClick={getAiSummarization} />
        </div>
        {!prioritizedChats && loading && (
          <div className="h-full flex flex-col items-center gap-2">
            <div className="text-link animate-pulse text-xs font-medium">
              Analyzing with AI
            </div>
            <SettingsIcon className="h-6 w-6 text-link animate-spin" />
          </div>
        )}
        {prioritizedChats && (
          <div className="flex flex-col animate-fadeIn">
            <div className="my-4 flex flex-col">
              <div className="text-link text-xs bg-link/30 rounded-xl px-2 py-1 mb-4 self-center">
                High priority
              </div>
              <div className="flex flex-col gap-4">
                {prioritizedChats[3].map((chat) => (
                  <div className="flex gap-2" key={chat.username}>
                    <img
                      loading="lazy"
                      src={`https://t.me/i/userpic/320/${chat.username.replace("@", "")}.svg`}
                      className="h-12 w-12 rounded-full"
                      decoding="async"
                      alt=""
                    />

                    <div className="flex flex-col">
                      <div className="text-link text-[10px]">
                        {chat.username}
                      </div>
                      <div className="text-hint text-xs">
                        {chat.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-4 flex flex-col">
              <div className="text-link text-xs bg-link/20 rounded-xl px-2 py-1 mb-4 self-center">
                Medium priority
              </div>
              <div className="flex flex-col gap-4">
                {prioritizedChats[2].map((chat) => (
                  <div className="flex gap-2" key={chat.username}>
                    <img
                      loading="lazy"
                      src={`https://t.me/i/userpic/320/${chat.username.replace("@", "")}.svg`}
                      className="h-12 w-12 rounded-full"
                      decoding="async"
                      alt=""
                    />

                    <div className="flex flex-col">
                      <div className="text-link text-[10px]">
                        {chat.username}
                      </div>
                      <div className="text-hint text-xs">
                        {chat.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-4 flex flex-col">
              <div className="text-link text-xs bg-link/10 rounded-xl px-2 py-1 mb-4 self-center">
                Low priority
              </div>
              <div className="flex flex-col gap-4">
                {prioritizedChats[1].map((chat) => (
                  <div className="flex gap-2" key={chat.username}>
                    <img
                      loading="lazy"
                      src={`https://t.me/i/userpic/320/${chat.username.replace("@", "")}.svg`}
                      className="h-12 w-12 rounded-full"
                      decoding="async"
                      alt=""
                    />

                    <div className="flex flex-col">
                      <div className="text-link text-[10px]">
                        {chat.username}
                      </div>
                      <div className="text-hint text-xs">
                        {chat.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
