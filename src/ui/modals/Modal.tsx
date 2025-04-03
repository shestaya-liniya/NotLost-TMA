import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useKeyboardState } from "@/helpers/useKeyboardState";
import useViewportSize from "@/helpers/useViewportHeight";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = (props: ModalProps) => {
  const viewportSize = useViewportSize();
  const keyboardState = useKeyboardState();
  const lp = retrieveLaunchParams();

  const [height, setHeight] = useState<number | string>("100dvh");

  useEffect(() => {
    if (["macos", "tdesktop", "web", "webview"].includes(lp.tgWebAppPlatform)) {
      return;
    }
    if (keyboardState) {
      if (localStorage.getItem("viewport-with-opened-keyboard")) {
        setHeight(
          parseInt(localStorage.getItem("viewport-with-opened-keyboard") ?? "0")
        );
      } else {
        setHeight(viewportSize?.[1] ?? 0);
      }
    } else {
      setHeight("100dvh");
    }
  }, [keyboardState]);

  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`absolute top-0 left-0 w-full z-50 transition-height duration-300 ease-in-out bg-black/30`}
            style={{
              height,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) props.onClose();
            }}
          >
            <div
              id={props.id}
              className={`bg-primary pointer-events-auto pt-6 pl-6 pr-6 pb-2 rounded-2xl shadow-lg transition-all ease-in-out absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-2xl font-semibold text-center mb-4">
                {props.title}
              </div>
              {props.children}
              <div
                className="absolute top-2 right-2 text-xl font-semibold text-link rounded-full bg-link/20 p-2"
                onClick={() => props.onClose()}
              >
                <RemoveIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

export class AlertModal {
  private static instance: AlertModal | null = null;
  private modalElement: HTMLDivElement;
  private contentElement: HTMLDivElement;

  private constructor() {
    this.modalElement = document.createElement("div");
    this.modalElement.id = "alert-modal"; // Unique ID to prevent duplicates
    this.modalElement.style.position = "fixed";
    this.modalElement.style.top = "0";
    this.modalElement.style.left = "0";
    this.modalElement.style.width = "100vw";
    this.modalElement.style.height = "100vh";
    this.modalElement.style.background = "rgba(0, 0, 0, 0.5)";
    this.modalElement.style.display = "flex";
    this.modalElement.style.justifyContent = "center";
    this.modalElement.style.alignItems = "center";
    this.modalElement.style.zIndex = "1000";
    this.modalElement.style.opacity = "0";
    this.modalElement.style.pointerEvents = "none";
    this.modalElement.style.transition = "opacity 0.3s ease";

    this.contentElement = document.createElement("div");
    this.contentElement.style.background = "var(--color-primary)";
    this.contentElement.style.padding = "20px";
    this.contentElement.style.borderRadius = "8px";
    this.contentElement.style.minWidth = "200px";
    this.contentElement.style.textAlign = "center";
    this.contentElement.style.transform = "scale(0.8)";
    this.contentElement.style.transition = "transform 0.3s ease";

    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) this.hide();
    });

    this.modalElement.appendChild(this.contentElement);
    document.body.appendChild(this.modalElement);
  }

  static getInstance(): AlertModal {
    if (!this.instance) {
      this.instance = new AlertModal();
    }
    return this.instance;
  }

  set content(html: string) {
    this.contentElement.innerHTML = html;
  }

  show(content: string) {
    this.contentElement.innerHTML = content;
    this.modalElement.style.opacity = "1";
    this.modalElement.style.pointerEvents = "auto";
    this.contentElement.style.transform = "scale(1)";
  }

  hide() {
    this.modalElement.style.opacity = "0";
    this.modalElement.style.pointerEvents = "none";
    this.contentElement.style.transform = "scale(0.8)";
  }
}
