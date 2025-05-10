import { DraggableItem, useDragStore } from "@/lib/store/dragStore";
import { memo, useRef } from "react";

// Dump implementation, every element will create a new listener, need to find a way to share a single listener
function Draggable(props: {
  children: React.ReactNode;
  draggableItem: DraggableItem | null;
  onDrag?: (e: React.TouchEvent) => void;
  onDrop?: () => void;
}) {
  const { setDraggableItem } = useDragStore();

  const ref = useRef<HTMLDivElement | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    let touch = e.touches[0];

    if (!ref.current) {
      return;
    }

    setDraggableItem(props.draggableItem);

    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!ref.current) return;

      ref.current.style.transition = "";

      touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      const dy = touch.clientY - startPos.y;

      props.onDrag?.(e);

      ref.current!.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const handleTouchEnd = () => {
      if (!ref.current) return;

      props.onDrop?.();

      setDraggableItem(null);
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
