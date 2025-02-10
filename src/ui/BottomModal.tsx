import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BottomModal = React.forwardRef(
  (props: ModalProps, ref: React.Ref<HTMLDivElement> | null = null) => {
    return (
      <div
        ref={ref}
        className={`bg-secondary pointer-events-auto p-6 rounded-t-2xl shadow-lg transition-all ease-in-out duration-300 absolute bottom-0 w-full ${
          props.isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-semibold text-center mb-4">
          {props.title}
        </div>
        {props.children}
        <div
          className="absolute top-2 right-4 text-xl font-semibold text-link"
          onClick={() => props.onClose()}
        >
          Done
        </div>
      </div>
    );
  }
);

BottomModal.displayName = "BottomModal";

export default BottomModal;
