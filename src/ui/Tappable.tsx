import { memo, useRef, useState } from "react";

function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  onClick?: () => void;
  onLongPress?: () => void;
  style?: object;
  ripple?: boolean;
}) {
  const ripple = props.ripple ?? true;

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

  const animateRipple = () => {
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 100);
  };

  return (
    <div
      style={props.style}
      className={`transition duration-150 ${active && "scale-98 opacity-85"}  ${props.className}`}
      onPointerDown={() => {
        if (props.onLongPress) {
          startPress();
        } else if (props.onTap) {
          props.onTap();
          if (ripple) {
            animateRipple();
          }
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
          props.onClick();
          if (ripple) {
            animateRipple();
          }
        }
      }}
    >
      {props.children}
    </div>
  );
}

export default memo(Tappable);
