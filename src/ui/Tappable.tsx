import { memo, useRef } from "react";

function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onLongPress?: () => void;
  style?: object;
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
      style={props.style}
      className={`transition duration-150 active:opacity-85 active:scale-98 ${props.className}`}
      onPointerDown={() => {
        if (props.onLongPress) {
          startPress();
        } else {
          props.onClick?.();
        }
      }}
      onPointerUp={() => {
        if (props.onLongPress) {
          endPress();
        } else {
          props.onClick?.();
        }
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
      onClick={() => {
        if (!props.onLongPress) {
          props.onClick?.();
        }
      }}
    >
      {props.children}
    </div>
  );
}

export default memo(Tappable);
