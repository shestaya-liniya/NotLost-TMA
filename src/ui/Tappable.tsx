import { memo, useRef } from "react";

function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onLongPress?: () => void;
}) {
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    activeRef.current = true;

    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      props.onLongPress?.();
    }, 200);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;

      if (!isLongPress.current) {
        props.onClick?.();
      }
    }
  };

  const activeRef = useRef(false);

  return (
    <div
      className={`transition duration-150 active:opacity-85 active:scale-98 ${props.className}`}
      onPointerDown={() => {
        startPress();
      }}
      onPointerUp={() => {
        endPress();
      }}
      onPointerLeave={() => {
        activeRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
      onTouchMove={() => {
        activeRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
    >
      {props.children}
    </div>
  );
}

export default memo(Tappable);
