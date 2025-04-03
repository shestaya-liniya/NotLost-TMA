import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import SettingsSection from "./SettingsSection";
import ColorPaletteIcon from "@/assets/icons/color-palette.svg?react";
import ColorCircle from "../ColorCircle";

export default function SettingsSectionColorScheme() {
  const { jazzProfile } = useJazzProfileContext();

  const setColorScheme = (colorScheme: string) => {
    jazzProfile.colorScheme = colorScheme;
    document.documentElement.setAttribute("data-theme", colorScheme);
  };
  const activeColor = jazzProfile.colorScheme;
  const activeColorScheme = jazzProfile.colorScheme + "-500";
  return (
    <SettingsSection
      Icon={<ColorPaletteIcon className="w-6 h-6 text-link" />}
      title="Color scheme"
    >
      <div className="flex justify-center items-center gap-4 flex-wrap">
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
    </SettingsSection>
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
