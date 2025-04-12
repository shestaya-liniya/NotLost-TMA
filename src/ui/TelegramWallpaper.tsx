import tgWallpaper from "@/assets/tg-wallpaper-paris.svg";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";
import { AnimatePresence, motion } from "framer-motion";

export default function TelegramWallpaper() {
  const { jazzProfile } = useJazzProfileContext();

  return (
    <AnimatePresence>
      {jazzProfile.wallpaperEnabled && (
        <motion.div
          key="wallpaper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
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
      )}
    </AnimatePresence>
  );
}
