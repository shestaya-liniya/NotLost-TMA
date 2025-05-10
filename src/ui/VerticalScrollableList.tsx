import {
  useScroll,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { ReactNode, useRef, useState, useLayoutEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function VerticalScrollableList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollYProgress);

  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setIsOverflowing(el.scrollHeight > el.clientHeight);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <motion.ul
      ref={ref}
      style={{
        maskImage: isOverflowing ? maskImage : undefined,
        WebkitMaskImage: isOverflowing ? maskImage : undefined,
        transition: "mask-image 0.15s ease, -webkit-mask-image 0.15s ease",
      }}
      className={twMerge(
        "flex flex-wrap gap-2 justify-center overflow-y-auto scrollbar-hide overscroll-contain",
        className
      )}
    >
      {children}
    </motion.ul>
  );
}

const left = `0%`;
const right = `100%`;
const leftInset = `20%`;
const rightInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;
function useScrollOverflowMask(scrollYProgress: MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(180deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      );
    } else if (
      scrollYProgress.getPrevious() === 0 ||
      scrollYProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(180deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}
