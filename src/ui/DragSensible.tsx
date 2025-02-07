import { useEffect, useRef, useState } from "react";

// Dump implementation, every element will create a new listener, need to find a way to share a single listener
export default function DragSensible({
  children,
  additionalCondition,
}: {
  children: React.ReactNode;
  additionalCondition: boolean;
}) {
  const [touchInside, setTouchInside] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const isTouchInside = (touch: Touch) => {
    if (!elementRef.current) return false;
    const elementBounds = elementRef.current.getBoundingClientRect();
    return (
      touch.clientX >= elementBounds.left &&
      touch.clientX <= elementBounds.right &&
      touch.clientY >= elementBounds.top &&
      touch.clientY <= elementBounds.bottom
    );
  };

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchInside(isTouchInside(touch));
  };

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchInside(isTouchInside(touch));
  };

  const onTouchEnd = () => {
    setTouchInside(false);
  };

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-300 ease-in-out ${touchInside && additionalCondition ? "bg-link/10" : ""}`}
      style={{
        touchAction: "none",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
