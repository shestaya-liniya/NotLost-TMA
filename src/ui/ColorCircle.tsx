import Tappable from "./Tappable";

export default function ColorCircle({
  color,
  activeColor,
  setActiveColor,
  size = "xs",
}: {
  color: string;
  activeColor: string;
  setActiveColor: (color: string) => void;
  size?: "xs" | "sm";
}) {
  return (
    <Tappable
      onClick={() => {
        setActiveColor(color);
      }}
    >
      <div
        className={`${size === "xs" ? "w-6 h-6" : "w-8 h-8"}  rounded-full bg-${color} ${activeColor === color ? "border-4 border-link" : ""}`}
      />
    </Tappable>
  );
}
