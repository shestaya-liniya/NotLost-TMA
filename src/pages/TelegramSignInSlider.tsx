import { SwiperSlider } from "@/ui/dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";
import utyaFolder from "@/assets/lottie/utya-folder.json";
import utyaSendCode from "@/assets/lottie/utya-send-code.json";
import DuckIcon from "@/assets/icons/duck-rubber.svg?react";
import CheckIcon from "@/assets/icons/check.svg?react";
import TelegramLogoIcon from "@/assets/icons/telegram-logo.svg?react";
import TelegramIcon from "@/assets/icons/telegram.svg?react";

import TickIcon from "@/assets/icons/tick.svg?react";
import ShieldIcon from "@/assets/icons/shield.svg?react";
import LockIcon from "@/assets/icons/lock.svg?react";
import EyeClosedIcon from "@/assets/icons/eye-closed.svg?react";
import PassportIcon from "@/assets/icons/passport.svg?react";

import Lottie from "lottie-react";
import Tappable from "@/ui/Tappable";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MockDialog {
  name: string;
}
export default function TelegramSignInSlider(props: { goToSync: () => void }) {
  const [selectedChats, setSelectedChats] = useState<MockDialog[]>([]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setSelectedChats((prev) => [...prev, mockDialogs[count]]);

      count++;

      if (count >= mockDialogs.length) {
        count = 0;
        setSelectedChats([]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full relative">
      <div>
        <SwiperSlider>
          <SwiperSlide style={{ minHeight: window.innerHeight - 300 }}>
            <div className="flex flex-col items-center mt-20 pb-10">
              <div className="h-[160px] w-[160px] relative top-4">
                <Lottie animationData={utyaFolder} loop={true} />
              </div>
              <div className="text-2xl font-bold text-center mt-8 px-8 capitalize">
                What is <span className="text-link">Telegram Sync</span> and why
                do you need it?
              </div>
              <div className="text-hint font-medium mt-6 text-sm text-center">
                Easily import your Telegram chats
              </div>
              <div className="grid grid-cols-3 gap-x-2 mt-4">
                {mockDialogs.map((d) => {
                  const isSelected = selectedChats.some(
                    (chat) => chat.name === d.name
                  );
                  return (
                    <Tappable
                      key={d.name + "-mock-dialog"}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 relative`}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary relative">
                        <DuckIcon className="h-7 w-7 text-secondary absolute left-1/2 top-1/2 -translate-1/2" />
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="w-5 h-5 rounded-full bg-link absolute bottom-0 right-0 flex items-center justify-center"
                            >
                              <CheckIcon className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <span
                        className={`px-2 py-[0.5px] text-xs font-normal  text-link  rounded-xl whitespace-nowrap `}
                      >
                        {d.name}
                      </span>
                    </Tappable>
                  );
                })}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              style={{ minHeight: window.innerHeight - 300 }}
              className="flex flex-col items-center mt-20 pb-10 min-h-full"
            >
              <div className="h-[160px] w-[160px]">
                <Lottie animationData={utyaSendCode} loop={true} />
              </div>
              <div className="text-2xl font-bold text-center mt-8 px-8 capitalize">
                All actions take place within{" "}
                <span className="text-link">Telegram.</span>
              </div>
              <div className="text-hint font-medium mt-6 text-sm px-8 text-center">
                The sync code will be sent by Telegram — no third-party apps
                involved.
              </div>
              <div className="flex bg-primary p-4 rounded-3xl gap-2 text-xs mx-8 items-start mt-8">
                <TelegramLogoIcon className="h-12 min-w-12 text-white" />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div>Telegram</div>
                    <TickIcon className="h-4 w-4 text-link ml-1" />
                    <div className="text-hint ml-auto font-light">Tue</div>
                  </div>
                  <div className="text-hint">
                    Login code <span className="blur-xs">XXXXXX</span>. Do not
                    give this code to anyone, even if they say they are from
                    Telegram!
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              style={{ minHeight: window.innerHeight - 300 }}
              className="flex flex-col items-center mt-20 pb-10 min-h-full"
            >
              <div className="h-[160px] w-[160px] p-6">
                <ShieldIcon className="h-full w-full text-link" />
              </div>
              <div className="text-2xl font-bold text-center mt-8 px-8 capitalize">
                With <span className="text-link">Telegram Sync</span>, your data
                is fully secure
              </div>
              <div className="px-8 flex flex-col items-center space-y-4 mt-8">
                <div className="flex gap-6">
                  <LockIcon className="w-8 h-8 text-link" />
                  <div className="text-hint font-medium text-xs">
                    NotLost fully complies with GDPR and never shares or stores
                    personal user data.
                  </div>
                </div>
                <div className="flex gap-6">
                  <PassportIcon className="w-8 h-8 text-link" />
                  <div className="text-hint font-medium text-xs">
                    We only use your Telegram session to sync your chats — no
                    external storage or contacts upload.
                  </div>
                </div>
                <div className="flex gap-6">
                  <EyeClosedIcon className="w-8 h-8 text-link" />
                  <div className="text-hint font-medium text-xs">
                    We don’t track, analyze, or use third-party tools — your
                    privacy is our priority.
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-12 rounded-full shadow-2xl shadow-link">
                <Tappable
                  onClick={props.goToSync}
                  className="bg-link ml-auto mr-auto rounded-full px-4 py-2"
                >
                  <div className="flex gap-2">
                    <TelegramIcon className="w-6 h-6" />
                    <div className="font-semibold">Telegram sync</div>
                  </div>
                </Tappable>
              </div>
            </div>
          </SwiperSlide>
        </SwiperSlider>
      </div>
    </div>
  );
}

const mockDialogs = [
  {
    name: "Andrei",
  },
  {
    name: "Polina",
  },
  {
    name: "Nikita",
  },
  {
    name: "Paul",
  },
  {
    name: "John",
  },
  {
    name: "Nick",
  },
  {
    name: "Mike",
  },
  {
    name: "Dan",
  },
  {
    name: "Jenna",
  },
];
