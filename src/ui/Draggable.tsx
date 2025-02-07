import { useDragStore } from "@/lib/zustand-store/drag-store";
import { memo, useRef } from "react";

function Draggable(props: {
  children: React.ReactNode;
  draggableItemType: "folder" | "contact" | null;
}) {
  const { setDragState } = useDragStore();

  const ref = useRef<HTMLDivElement | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    let touch = e.touches[0];

    if (!ref.current) {
      return;
    }

    setDragState({
      draggableItemType: props.draggableItemType,
    });

    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      ref.current!.style.transition = "";

      touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      const dy = touch.clientY - startPos.y;

      ref.current!.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const handleTouchEnd = () => {
      setDragState({
        draggableItemType: null,
      });

      ref.current!.style.transition = `transform 0.3s ease`;
      ref.current!.style.transform = `translate(0px, 0px)`;

      document.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      document.removeEventListener("touchend", handleTouchEnd);
    };
    document.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener
    );
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={ref}
      className="relative touch-none"
      onTouchStart={handleTouchStart}
    >
      {props.children}
    </div>
  );
}

export default memo(Draggable);
