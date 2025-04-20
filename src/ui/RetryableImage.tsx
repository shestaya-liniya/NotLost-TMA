import { useState, useEffect } from "react";

export default function RetryableImage(props: {
  src: string;
  alt?: string;
  maxRetries: number;
  delay: number;
  className: string;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(props.src);

  useEffect(() => {
    setCurrentSrc(props.src);
    setRetryCount(0);
  }, [props.src]);

  const handleError = () => {
    if (retryCount < props.maxRetries) {
      setTimeout(() => {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        setCurrentSrc(`${props.src}?retry=${newRetryCount}`);
      }, props.delay);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={props.alt}
      onError={handleError}
      className={props.className}
    />
  );
}
