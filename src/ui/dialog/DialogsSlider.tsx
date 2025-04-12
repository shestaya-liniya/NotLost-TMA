import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { TelegramDialogInfo } from "@/lib/telegram/api/telegramApiClient";
import Tappable from "../Tappable";
import { truncateWord } from "@/helpers/truncateWord";
import { v4 as uuidv4 } from "uuid";

export default function DialogsSlider({
  selectedDialogs,
  setSelectedDialogs,
  dialogs,
  direction = "horizontal",
}: {
  dialogs: TelegramDialogInfo[];
  selectedDialogs: TelegramDialogInfo[];
  setSelectedDialogs: (selectedDialogs: TelegramDialogInfo[]) => void;
  direction?: "vertical" | "horizontal";
}) {
  // Split dialogs into chunks of 9
  const chunkedDialogs = Array.from(
    { length: Math.ceil(dialogs.length / 9) },
    (_, i) => dialogs.slice(i * 9, i * 9 + 9)
  );

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      direction={direction}
      autoHeight={true}
      height={288}
    >
      {chunkedDialogs.map((group) => (
        <SwiperSlide key={Math.random()}>
          <div className="grid grid-cols-3 gap-2 px-4 pr-6 pt-2 pb-2">
            {group.map((d) => {
              const isSelected = selectedDialogs.some(
                (dialog) => dialog.username === d.username
              );
              return (
                <Tappable
                  key={uuidv4()}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 relative ${isSelected ? "bg-accent" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDialogs(
                        selectedDialogs.filter(
                          (chat) => chat.username !== d.username
                        )
                      );
                    } else {
                      setSelectedDialogs([...selectedDialogs, d]);
                    }
                  }}
                >
                  <img
                    loading="lazy"
                    src={`https://t.me/i/userpic/320/${d.username}.svg`}
                    className="h-12 w-12 rounded-full"
                    decoding="async"
                    alt=""
                  />

                  <span
                    className={`px-2 py-[0.5px] text-xs font-normal bg-link/10 text-link  rounded-xl whitespace-nowrap ${isSelected ? "text-secondary" : ""}`}
                  >
                    {truncateWord(d.label || "", 5)}
                  </span>
                </Tappable>
              );
            })}
          </div>
        </SwiperSlide>
      ))}
      {direction === "horizontal" && <div className="h-4 w-full"></div>}
    </Swiper>
  );
}

export const SwiperSlider = ({
  children,
  direction = "horizontal",
}: {
  children: React.ReactElement[] | null;
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      direction={direction}
    >
      {children}
      {direction === "horizontal" && <div className="h-4 w-full"></div>}
    </Swiper>
  );
};
