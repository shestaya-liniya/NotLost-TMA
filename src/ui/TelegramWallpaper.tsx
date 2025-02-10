import tgWallpaper from "@/assets/tg-wallpaper-paris.svg";

export default function TelegramWallpaper() {
  return (
    <div
      className="h-full w-full -z-10 absolute bg-link/5"
      style={{
        maskImage: `url(${tgWallpaper})`,
        WebkitMaskImage: `url(${tgWallpaper})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
