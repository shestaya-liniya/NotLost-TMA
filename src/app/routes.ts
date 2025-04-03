export const ROUTES = {
  AI: "/ai",
  FOLDERS: "/folders",
  EVENTS: "/events",
  DIALOG_INFO: "/dialog-info",
  TELEGRAM_SIGN_IN: "/telegram-sign-in",
  SETTINGS: "/settings",
  GRAPH: "/graph",
};

export const OVERLAY_ROUTES = [
  ROUTES.DIALOG_INFO,
  ROUTES.TELEGRAM_SIGN_IN,
  ROUTES.SETTINGS,
  ROUTES.GRAPH,
];

export const isOverlayRoute = (path: string): boolean => {
  return OVERLAY_ROUTES.some((route) => path === route);
};

export const tabAnimations = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  }),
};

export const overlayAnimations = {
  initial: {
    x: "100%",
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export const fadeAnimations = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
