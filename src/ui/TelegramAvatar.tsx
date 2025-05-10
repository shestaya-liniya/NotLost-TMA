import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TelegramAvatar(props: {
  username: string;
  className?: string;
}) {
  const [src, setSrc] = useState(
    `https://t.me/i/userpic/320/${props.username}.svg`
  );
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount < 4) {
      setTimeout(() => {
        setSrc(`${src}?retry=${Date.now()}`); // timestamp to bust cache
        setRetryCount((c) => c + 1);
      }, 500);
    }
  };

  return (
    <img
      loading="lazy"
      src={src}
      className={twMerge("rounded-full mt-2", props.className)}
      decoding="async"
      alt="Telegram avatar"
      onError={handleError}
    />
  );
}
