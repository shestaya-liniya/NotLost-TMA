import { useState, useEffect, ReactNode, ComponentType } from "react";

// Basically the same as {someValue && <Component/>} but with a delayed unmount
// to allow sliding animations

export function DelayedUnmount({
  mounted,
  delay = 350, // 50 as a buffer
  children,
  Wrapper,
}: {
  mounted: boolean;
  delay?: number;
  children: ReactNode;
  Wrapper?: ComponentType<{ children: ReactNode }>;
}) {
  const [shouldRender, setShouldRender] = useState(mounted);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (mounted) {
      setShouldRender(true);
    } else {
      timeout = setTimeout(() => setShouldRender(false), delay);
    }

    return () => clearTimeout(timeout);
  }, [mounted, delay]);

  if (shouldRender && Wrapper) {
    return <Wrapper>{children}</Wrapper>;
  }

  if (shouldRender) {
    return <>{children}</>;
  } else null;
}
