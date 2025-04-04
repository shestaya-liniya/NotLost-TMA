import Tappable from "@/ui/Tappable";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import FavIcon from "@/assets/icons/favorite.svg?react";
import NavigationIcon from "@/assets/icons/navigation.svg?react";
import { useModalStore } from "@/lib/store/modalStore";
import { useEffect, useState } from "react";

import { backButton, retrieveLaunchParams } from "@telegram-apps/sdk-react";

import winzavod from "@/assets/winzavod.png";
import winzavodSlider from "@/assets/winzavod-slider.png";
import reflection from "@/assets/relfection.png";
import EventIcon from "@/assets/icons/calendar-2.svg?react";
import MapPointIcon from "@/assets/icons/map-point.svg?react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import { SwiperSlider } from "@/ui/dialog/DialogsSlider";
import { SwiperSlide } from "swiper/react";
import ChevronRight from "@/assets/icons/chevron-right.svg?react";
import QrIcon from "@/assets/icons/qr.svg?react";
import BottomModal from "@/ui/modals/BottomModal";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import Modal from "@/ui/modals/Modal";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";

// In that component custom animation is used for the folder height
// To provide smoothest transition, translate animation is used, as height animation is expensive
// To make smooth transition of all folders going down/up when some folder is expanded,
// every folder is positioned in absolute and have a dynamic inset top that is updated on every folder height change
// Such overhead provide best performance for low end devices

export default function Events() {
  const location = useLocation();
  const { setSettingsModalOpen } = useModalStore();

  return (
    <div className="h-full flex flex-col relative">
      <div
        style={{
          paddingTop: getMiniAppTopInset(),
        }}
        className="px-4 py-2 bg-secondary border-b-2 border-primary/30 relative"
      >
        <div className="relative flex justify-between mt-2 items-center">
          <Tappable
            onClick={() => {
              setSettingsModalOpen(true);
            }}
            className="flex gap-2 text-link items-center pl-2 pr-2 py-2 rounded-xl"
          >
            <SettingsIcon className="h-7 w-7 " />
          </Tappable>
          <div className="flex items-center text-link gap-5 pr-2">
            <div className="relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-9 w-9 bg-link/10 rounded-full"></div>
              <FavIcon className="h-7 w-7" />
            </div>
            <div className="relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-9 w-9 bg-link/10 rounded-full"></div>
              <NavigationIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="text-link font-semibold text-center absolute bottom-4 w-full pr-8 pointer-events-none">
          Events
        </div>
      </div>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <div className="p-4 space-y-4">
                  <div className="text-2xl font-extralight text-white/80 text-center">
                    Актуальные локации
                  </div>
                  <EventCard />
                  <EventCard />
                  <EventCard />
                </div>
              </PageWrapper>
            }
          />
          <Route path="/event-info" element={<EventInfo />} />
          <Route path="/event-info/enter" element={<PeopleOnEvent />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

const PeopleOnEvent = () => {
  const lp = retrieveLaunchParams();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<"all-chats" | "groups">(
    "all-chats"
  );
  const [showModal, setShowModal] = useState(false);
  const [usernameToRedirect, setUsernameToRedirect] = useState("");

  useEffect(() => {
    if (backButton.isSupported()) {
      try {
        backButton.show();
        backButton.onClick(() => navigate("/tab-bar/event-info"));
      } catch (e) {
        console.log(e);
      }
    }
  }, []);
  return (
    <PageWrapper>
      <div className="px-4 pb-4 min-h-full bg-secondary flex flex-col">
        <div className="bg-primary/50 -mr-4 -ml-4">
          {lp.tgWebAppPlatform === "tdesktop" && (
            <Tappable
              onClick={() => navigate("/tab-bar/event-info")}
              className="bg-link/20 w-32 text-link rounded-lg py-1 font-semibold text-xs  text-center flex items-center gap-1 px-1"
            >
              <ChevronRight className="w-3 h-3 rotate-180 text-link" />
              Return to Events
            </Tappable>
          )}
          <div className="text-2xl font-medium text-center mb-2 mt-4">
            Знакомство на Винзаводе
          </div>
          <div className="py-2 border-b-2 border-primary/30 px-4">
            <div className="flex gap-2 relative top-[9px]">
              <Tappable
                onClick={() => setSelectedTab("all-chats")}
                className={twMerge(
                  `text-hint ${selectedTab === "all-chats" && "text-link underline underline-offset-5"}`
                )}
              >
                Все чаты
              </Tappable>
              <Tappable
                onClick={() => setSelectedTab("groups")}
                className={twMerge(
                  `text-hint ${selectedTab === "groups" && "text-link underline underline-offset-5"}`
                )}
              >
                Группы
              </Tappable>
            </div>
          </div>
        </div>

        {selectedTab === "all-chats" && (
          <div>
            <Tappable
              onClick={() => {
                window.open(`https://t.me/shestaya_liniya`);
              }}
              className="flex mt-4"
            >
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/shestaya_liniya.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Андрей</div>
                <div className="text-hint text-xs">Сообщение...</div>
              </div>
            </Tappable>
            <div className="h-[1px] bg-primary/50 w-full mt-2"></div>
            <Tappable
              onClick={() => {
                setUsernameToRedirect("skywl_k");
                setShowModal(true);
              }}
              className="flex mt-2"
            >
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/skywl_k.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Андрей</div>
                <div className="text-hint text-xs">Сообщение...</div>
              </div>
              <div>
                <div className="bg-link rounded-full px-2 py-1 font-semibold text-xs">
                  Организатор
                </div>
              </div>
            </Tappable>
            <div className="h-[1px] bg-primary/50 w-full mt-2"></div>
            <Tappable
              onClick={() => {
                setUsernameToRedirect("kopolinaa");
                setShowModal(true);
              }}
              className="flex mt-2"
            >
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/kopolinaa.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Полина</div>
                <div className="text-hint text-xs">Сообщение...</div>
              </div>
              <div>
                <div className="bg-link rounded-full px-2 py-1 font-semibold text-xs">
                  Художница
                </div>
              </div>
            </Tappable>
          </div>
        )}

        {selectedTab === "groups" && (
          <div>
            <div className="flex mt-4">
              <div></div>
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/shestaya_liniya.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Название</div>
                <div className="text-hint text-xs">Андрей, Полина</div>
              </div>
            </div>
            <div className="h-[1px] bg-primary/50 w-full mt-2"></div>
            <div className="flex mt-2">
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/skywl_k.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Название</div>
                <div className="text-hint text-xs">Андрей, Полина</div>
              </div>
            </div>
            <div className="h-[1px] bg-primary/50 w-full mt-2"></div>
            <div className="flex mt-2">
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/kopolinaa.svg`}
                className="h-12 w-12 rounded-full"
                decoding="async"
                alt=""
              />
              <div className="flex flex-col flex-1 ml-4">
                <div>Название</div>
                <div className="text-hint text-xs">Андрей, Полина</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {createPortal(
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Оплата чата"
        >
          <div className="flex flex-col items-center">
            <div className="text-lg text-link font-medium">1 час</div>
            <Tappable
              onClick={() => {
                window.open(`https://t.me/${usernameToRedirect}`);
                setShowModal(false);
              }}
              className="bg-link text-lg rounded-full px-4 py-3 font-semibold mt-2 mb-4"
            >
              Оплатить
            </Tappable>
          </div>
        </Modal>,
        document.body
      )}
    </PageWrapper>
  );
};

const EventInfo = () => {
  const navigate = useNavigate();
  const lp = retrieveLaunchParams();

  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    if (backButton.isSupported()) {
      try {
        backButton.show();
        backButton.onClick(() => navigate("/tab-bar"));
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return (
    <PageWrapper>
      <div className="p-4 min-h-full bg-secondary flex flex-col">
        {lp.tgWebAppPlatform === "tdesktop" && (
          <Tappable
            onClick={() => navigate("/tab-bar")}
            className="bg-link/20 w-32 text-link rounded-lg py-1 font-semibold text-xs  text-center flex items-center gap-1 px-1"
          >
            <ChevronRight className="w-3 h-3 rotate-180 text-link" />
            Return to Events
          </Tappable>
        )}

        <div className="text-2xl font-medium text-center mb-2 mt-4">
          Винзавод
        </div>
        <div className="-ml-4 -mr-4">
          <SwiperSlider>
            <SwiperSlide>
              <img src={winzavodSlider} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={winzavodSlider} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={winzavodSlider} alt="" />
            </SwiperSlide>
            <div className="h-4"></div>
          </SwiperSlider>
        </div>
        <div className="text-xl font-medium text-center mt-2 text-white/50">
          Актуальные события
        </div>
        <div className="mt-4 space-y-4">
          <Tappable onClick={() => setQrModalOpen(true)}>
            <EventInfoCard />
          </Tappable>
        </div>
      </div>
      {createPortal(
        <BottomModal
          id={""}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          title={"Check-In"}
          className="pb-8 flex flex-col items-center"
        >
          <div className="font-extralight text-xs text-hint relative -top-4">
            Отражения/Рефлексии
          </div>
          <div className="w-[80%] h-[1px] bg-white/10 rounded-full relative -top-3"></div>
          <Tappable
            onClick={() => {
              setQrModalOpen(false);
              setTimeout(() => {
                navigate("enter");
              }, 300);
            }}
            className="flex flex-col items-center justify-center mt-2"
          >
            <span className="bg-link rounded-full font-semibold py-2 px-4 flex gap-2 items-center">
              <QrIcon className="w-8 h-8" />
              Scan QR
            </span>
          </Tappable>
          <div className="text-xs text-hint mt-2">
            * Currently will just redirect you to event without scanning
          </div>
        </BottomModal>,
        document.body
      )}
    </PageWrapper>
  );
};

const EventCard = () => {
  const navigate = useNavigate();
  return (
    <Tappable
      className="bg-primary rounded-2xl px-2 pt-2 pb-4 w-full"
      onClick={() => {
        navigate("event-info");
      }}
    >
      <div className="flex justify-between">
        <div className="px-2">
          <div className="text-xl font-medium">Винзавод</div>
          <div className="text-white/60 font-semibold text-xs mt-1">
            Ближайшее событие:{" "}
            <div className="text-link flex gap-1 items-center mt-2">
              <div className="w-4">
                <EventIcon className="w-4 h-4 text-link" />
              </div>
              <div>23.04.25</div>
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            <div className="min-w-4">
              <MapPointIcon className="w-4 h-4 text-link" />
            </div>
            <div className="text-xs text-white/80">
              4-й Сыромятнический переулок
            </div>
          </div>
        </div>
        <div className="px-4 flex items-center justify-center">
          <img
            src={winzavod}
            className="w-[60px] min-w-[80px] h-[80px]"
            alt=""
          />
        </div>
      </div>
    </Tappable>
  );
};

const EventInfoCard = () => {
  return (
    <div className="bg-primary rounded-2xl px-2 pt-2 pb-4 w-full">
      <div className="flex justify-between">
        <div className="px-2">
          <div className="text-xl font-medium whitespace-nowrap">
            Отражения/Рефлексии
          </div>
          <div className="text-white/60 font-semibold text-xs mt-1">
            Галерея pop/off/art представляет юбилейную групповую выставку
            «Отражения/Рефлексии»
          </div>
          <div className="flex gap-1 mt-1 items-center mt-2">
            <div className="h-2 w-2 bg-link rounded-full"></div>
            <div className="text-xs text-white/80">МАКСИМОВ Максим</div>
          </div>
          <div className="flex gap-1 mt-1 items-center">
            <div className="h-2 w-2 bg-link rounded-full"></div>
            <div className="text-xs text-white/80">МАКСИМОВ Максим</div>
          </div>
          <div className="text-link flex gap-1 items-center mt-2">
            <div className="w-4">
              <EventIcon className="w-4 h-4 text-link" />
            </div>
            <div className="text-xs">23.04.25</div>
          </div>
        </div>
        <div className="px-4 flex items-center justify-center">
          <img
            src={reflection}
            className="w-[60px] min-w-[80px] h-[100px]"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 170);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
