import ColorPaletteIcon from "@/assets/icons/color-palette.svg?react";
import TelegramIcon from "@/assets/icons/telegram.svg?react";
import ColorCircle from "@/ui/ColorCircle";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { useTelegramSession } from "@/helpers/telegram/telegramSession";
import Tappable from "@/ui/Tappable";
import { useModalStore } from "@/lib/store/modal-store";
import { getMiniAppTopInset } from "@/helpers/css/get-top-tg-inset";

export default function Settings() {
  const { jazzProfile } = useJazzProfileContext();
  const { setTelegramSignInModalOpen, setSettingsModalOpen } = useModalStore();
  const { deleteSession, signedIn } = useTelegramSession();

  const setColorScheme = (colorScheme: string) => {
    jazzProfile.colorScheme = colorScheme;
    document.documentElement.setAttribute("data-theme", colorScheme);
  };
  const activeColor = jazzProfile.colorScheme;
  const activeColorScheme = jazzProfile.colorScheme + "-500";

  const handleLogout = () => {
    deleteSession();
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full px-4"
      style={{ paddingTop: getMiniAppTopInset() }}
    >
      <div className="text-xl font-semibold mt-1 text-link">Settings</div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 w-full font-semibold flex gap-4 mt-4`}
      >
        <ColorPaletteIcon className="w-6 h-6 text-link" />
        Color scheme
      </div>
      <div className="bg-secondary border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-primary/30 p-4 w-full flex justify-center items-center gap-4 flex-wrap">
        <ColorCircles
          activeColorScheme={activeColorScheme}
          setColorScheme={(color: string) => setColorScheme(color)}
        />
        <div
          className="flex flex-col items-center justify-center gap-1"
          onClick={() => setColorScheme("white")}
        >
          <div
            style={{
              background: "white",
            }}
            className={`w-8 h-8  rounded-full ${activeColor === "white" ? "border-4 border-link" : ""}`}
          ></div>
          <div
            className={`text-[10px] ${activeColor === "white" ? "text-link" : "text-hint"}`}
          >
            White
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-1"
          onClick={() => setColorScheme("none")}
        >
          <div
            style={{
              background: "var(--tg-theme-link-color)",
            }}
            className={`w-8 h-8  rounded-full ${activeColor === "none" ? "border-4 border-link" : ""}`}
          ></div>
          <div
            className={`text-[10px] ${activeColor === "none" ? "text-link" : "text-hint"}`}
          >
            Telegram
          </div>
        </div>
      </div>
      <div
        className={`rounded-2xl items-center bg-primary px-6 py-4 w-full font-semibold flex mt-4`}
      >
        <div className="flex gap-4 flex-1">
          <TelegramIcon className="w-6 h-6 text-link" />
          Telegram Sync
        </div>
        <div>
          {signedIn ? (
            <Tappable
              className="bg-link/10 rounded-xl px-4 py-1 text-link"
              onClick={handleLogout}
            >
              Log out
            </Tappable>
          ) : (
            <Tappable
              className="bg-link/10 rounded-xl px-4 py-1 text-link"
              onClick={() => {
                setSettingsModalOpen(false);
                setTimeout(() => {
                  setTelegramSignInModalOpen(true);
                }, 300);
              }}
            >
              Sync
            </Tappable>
          )}
        </div>
      </div>
    </div>
  );
}

const ColorCircleWithTitle = ({
  color,
  activeColor,
  title,
  onClick,
}: {
  color: string;
  activeColor: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1"
      onClick={onClick}
    >
      <ColorCircle
        color={color}
        activeColor={activeColor}
        size="sm"
        setActiveColor={() => {}}
      />
      <div
        className={`text-[10px] ${activeColor === color ? "text-link" : "text-hint"}`}
      >
        {title}
      </div>
    </div>
  );
};

const ColorCircles = (props: {
  activeColorScheme: string;
  setColorScheme: (color: string) => void;
}) => {
  return (
    <>
      <ColorCircleWithTitle
        title="Cold blue"
        color="blue-500"
        activeColor={props.activeColorScheme}
        onClick={() => props.setColorScheme("blue")}
      />
      <ColorCircleWithTitle
        title="Forest green"
        color="green-500"
        activeColor={props.activeColorScheme}
        onClick={() => props.setColorScheme("green")}
      />
      <ColorCircleWithTitle
        title="Peach pink"
        color="pink-500"
        activeColor={props.activeColorScheme}
        onClick={() => props.setColorScheme("pink")}
      />
      <ColorCircleWithTitle
        title="Night purple"
        color="purple-500"
        activeColor={props.activeColorScheme}
        onClick={() => props.setColorScheme("purple")}
      />
    </>
  );
};
