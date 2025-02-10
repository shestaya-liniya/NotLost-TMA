import { memo, useRef } from "react";

function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}) {
  const activeRef = useRef(false);

  const handleClick = () => {
    if (props.onClick) {
      requestAnimationFrame(props.onClick);
    }
  };

  return (
    <div
      className={`transition duration-150 active:opacity-85 active:scale-98 ${props.className}`}
      onPointerDown={() => {
        activeRef.current = true;
      }}
      onPointerUp={() => {
        activeRef.current = false;
      }}
      onPointerLeave={() => {
        activeRef.current = false;
      }}
      onClick={handleClick}
      onTouchStart={props.onTouchStart}
      onTouchEnd={props.onTouchEnd}
    >
      {props.children}
    </div>
  );
}

export default memo(Tappable);
