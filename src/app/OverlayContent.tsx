import { useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import Tappable from "@/ui/Tappable";
import TelegramWallpaper from "@/ui/TelegramWallpaper";

interface OverlayContentProps {
  children: React.ReactNode;
  onClose: () => void;
}

const OverlayContent = ({ children, onClose }: OverlayContentProps) => {
  // Handle back button
  useEffect(() => {
    if (backButton.isSupported()) {
      try {
        backButton.show();
        backButton.onClick(onClose);

        return () => {
          backButton.offClick(onClose);
          backButton.hide();
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [onClose]);

  return (
    <div
      style={{ height: "var(--initial-height)" }}
      className="absolute top-0 left-0 w-screen bg-secondary z-50"
    >
      {/* Development mode back button */}
      {import.meta.env.MODE === "development" && (
        <Tappable
          onClick={onClose}
          className="top-5 left-5 absolute bg-link/10 rounded-2xl px-2 py-1 text-link z-[1000px]"
        >
          Back
        </Tappable>
      )}

      <TelegramWallpaper />
      {children}
    </div>
  );
};

export default OverlayContent;
