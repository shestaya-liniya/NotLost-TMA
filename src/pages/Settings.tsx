import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import ColorPaletteIcon from "@/assets/icons/color-palette.svg?react";
import ColorCircle from "@/ui/ColorCircle";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";

export default function Settings() {
  const lp = retrieveLaunchParams();
  const { jazzProfile } = useJazzProfileContext();

  const changeColorScheme = (colorScheme: string) => {
    jazzProfile.colorScheme = colorScheme;
    document.documentElement.setAttribute("data-theme", colorScheme);
  };
  const activeColor = jazzProfile.colorScheme;
  const activeColorScheme = jazzProfile.colorScheme + "-500";

  return (
    <div
      className="flex flex-col items-center justify-center w-full px-4"
      style={{
        paddingTop: ["macos", "tdesktop"].includes(lp.tgWebAppPlatform)
          ? 40
          : "calc(var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top))",
      }}
    >
      <div className="text-xl font-semibold mt-1 text-link">Settings</div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 w-full font-semibold flex gap-4 mt-4`}
      >
        <ColorPaletteIcon className="w-6 h-6 text-link" />
        Color scheme
      </div>
      <div className="bg-secondary border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl border-primary/30 p-4 w-full flex justify-center items-center gap-4 flex-wrap">
        <ColorCircleWithTitle
          title="Cold blue"
          color="blue-500"
          activeColor={activeColorScheme}
          onClick={() => changeColorScheme("blue")}
        />
        <ColorCircleWithTitle
          title="Forest green"
          color="green-500"
          activeColor={activeColorScheme}
          onClick={() => changeColorScheme("green")}
        />
        <ColorCircleWithTitle
          title="Peach pink"
          color="pink-500"
          activeColor={activeColorScheme}
          onClick={() => changeColorScheme("pink")}
        />
        <ColorCircleWithTitle
          title="Night purple"
          color="purple-500"
          activeColor={activeColorScheme}
          onClick={() => changeColorScheme("purple")}
        />
        <div
          className="flex flex-col items-center justify-center gap-1"
          onClick={() => changeColorScheme("white")}
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
          onClick={() => changeColorScheme("none")}
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
