import { memo, useRef, useState } from "react";

function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onClick?: () => void;
  onLongPress?: () => void;
  style?: object;
}) {
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);
  const [active, setActive] = useState(false);

  const startPress = () => {
    isLongPress.current = false;
    setActive(true);

    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      props.onLongPress?.();
    }, 200);
  };

  /* const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;

      if (!isLongPress.current) {
        props.onClick?.();
      }
    }
  }; */

  return (
    <div
      style={props.style}
      className={`transition duration-150 ${active && "scale-98 opacity-85"}  ${props.className}`}
      onPointerDown={() => {
        if (props.onLongPress) {
          startPress();
        } else if (props.onTap) {
          setActive(true);
          props.onTap();
          setTimeout(() => {
            setActive(false);
          }, 100);
        }
      }}
      /* onPointerUp={() => {
        endPress();
      }} */
      /* onPointerLeave={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }}
      onTouchMove={() => {
        setActive(false);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }} */
      onClick={() => {
        if (!props.onLongPress && props.onClick) {
          setActive(true);
          props.onClick();
          setTimeout(() => {
            setActive(false);
          }, 100);
        }
      }}
    >
      {props.children}
    </div>
  );
}

export default memo(Tappable);
