import RemoveIcon from "@/assets/icons/remove.svg?react";
import { useEffect } from "react";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BottomModal = (props: ModalProps) => {
  // Set correct viewport height for Safari
  useEffect(() => {
    const setViewportHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => window.removeEventListener("resize", setViewportHeight);
  }, []);
  return (
    <div
      id={props.id}
      className={`bg-primary pointer-events-auto p-6 rounded-t-2xl shadow-lg transition-all ease-in-out duration-300  absolute z-50 bottom-0 w-full ${
        props.isOpen
          ? "animate-slideUp  "
          : "translate-y-full animate-slideDown"
      }`}
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
  );
};

export default BottomModal;
