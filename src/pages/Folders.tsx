import Accordion from "@/ui/Accordion";
import Input from "@/ui/Input";
import Tappable from "@/ui/Tappable";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { useModalStore } from "@/lib/zustand-store/modal-store";
import { useEffect, useRef, useState } from "react";

export default function Folders() {
  const { setManageDialogsModalOpen } = useModalStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input label="Folder Name" value="" onInput={() => {}} />
      </div>
      <div className="space-y-4 mt-4 overflow-y-auto overscroll-none pb-20 max-h-screen">
        <DragSensibleElement>
          <div className="p-4">
            <Accordion title="Folder 13">
              <div>Hello</div>
            </Accordion>
          </div>
        </DragSensibleElement>
        <DragSensibleElement>
          <div className="p-4">
            <Accordion title="Folder 13">
              <div>Hello</div>
            </Accordion>
          </div>
        </DragSensibleElement>
        <DragSensibleElement>
          <div className="p-4">
            <Accordion title="Folder 13">
              <div>Hello</div>
            </Accordion>
          </div>
        </DragSensibleElement>
        <DragSensibleElement>
          <div className="p-4">
            <Accordion title="Folder 13">
              <div>Hello</div>
            </Accordion>
          </div>
        </DragSensibleElement>
      </div>

      <Tappable
        className="p-3 rounded-full bg-link fixed bottom-10 right-8 z-50"
        onClick={() => setManageDialogsModalOpen(true)}
      >
        <PencilIcon className="w-7 h-7" />
      </Tappable>
    </div>
  );
}

const DragSensibleElement = ({ children }: { children: React.ReactNode }) => {
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
      className={`${touchInside ? "bg-link/10" : ""}`}
      style={{
        touchAction: "none",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};
