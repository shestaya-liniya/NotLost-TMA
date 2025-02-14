import RemoveIcon from "@/assets/icons/remove.svg?react";
import useViewportSize from "@/helpers/use-viewport-height";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BottomModal = (props: ModalProps) => {
  const viewportSize = useViewportSize();
  const windowHeightMinusVisibleHeight =
    window.innerHeight - (viewportSize?.[1] ?? 0);
  return (
    <div
      className={`absolute top-0 left-0 w-full z-50 pointer-events-none transition-transform duration-300 ease-in-out `}
      style={{
        height: "100dvh",
        transform: `translateY(-${windowHeightMinusVisibleHeight}px)`,
      }}
    >
      <div
        id={props.id}
        className={`bg-primary pointer-events-auto p-6 rounded-t-2xl shadow-lg transition-all ease-in-out absolute bottom-0 w-full duration-300 ${
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
    </div>
  );
};

export default BottomModal;
