import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useKeyboardState } from "@/helpers/useKeyboardHeight";
import useViewportSize from "@/helpers/useViewportHeight";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
}

const BottomModal = (props: ModalProps) => {
  const viewportSize = useViewportSize();
  const keyboardState = useKeyboardState();
  const lp = retrieveLaunchParams();
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (keyboardState) {
      console.log(
        "viewport-with-opened-keyboard",
        localStorage.getItem("viewport-with-opened-keyboard"),
        window.innerHeight
      );

      if (localStorage.getItem("viewport-with-opened-keyboard")) {
        setTranslateY(
          window.innerHeight -
            parseInt(
              localStorage.getItem("viewport-with-opened-keyboard") ?? "0"
            )
        );
      } else {
        setTranslateY(window.innerHeight - (viewportSize?.[1] ?? 0));
      }
    } else {
      setTranslateY(0);
    }
  }, [keyboardState]);

  /* useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (props.isOpen) {
        event.preventDefault();
        props.onClose();
      }
    };

    if (props.isOpen) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [props.isOpen]); */

  return (
    <div
      className={`absolute top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        props.isOpen ? "bg-black/30 pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        height: "100dvh",
        transform:
          lp.tgWebAppPlatform === "ios" ? `translateY(-${translateY}px)` : "",
      }}
      onPointerDown={props.onClose}
    >
      <div
        id={props.id}
        className={twMerge(
          `bg-primary/80 backdrop-blur-xs pointer-events-auto pt-6 pl-6 pr-6 pb-2 rounded-t-2xl shadow-lg transition-all ease-in-out absolute bottom-0 w-full duration-300 ${
            props.isOpen
              ? "animate-slideUp  "
              : "translate-y-full animate-slideDown"
          }`,
          props.className
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-semibold text-center mb-4">
          {props.title}
        </div>
        {props.children}
        <div
          className="absolute top-2 right-2 text-xl font-semibold rounded-full bg-secondary/50 p-2"
          onPointerDown={() => props.onClose()}
        >
          <RemoveIcon className="w-4 h-4 text-white/80" />
        </div>
      </div>
    </div>
  );
};

export default BottomModal;
