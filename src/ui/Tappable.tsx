import { useState } from "react";


export default function Tappable(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    setTimeout(() => {
      setActive(false);
      props.onClick?.();
    }, 100);
  };

  return (
    <div
      className={`transition duration-150 ${
        active ? "opacity-85 scale-98" : "opacity-100 scale-100"
      } ${props.className}`}
      onPointerDown={() => {
        setActive(true);
      }}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
}
