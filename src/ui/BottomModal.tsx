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
  return (
    <div style={{ height: viewportSize?.[1] }}>
      <div
        id={props.id}
        className={`bg-primary pointer-events-auto p-6 rounded-t-2xl shadow-lg transition-all ease-in-out duration-300  absolute z-50 bottom-0 w-full animate-slideUp`}
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
