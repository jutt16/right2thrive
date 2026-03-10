/**
 * Shared Framer Motion variants for consistent, professional animations.
 * Stagger delays and spring config tuned for snappy but not jarring motion.
 */

export const springFast = { type: "spring" as const, stiffness: 400, damping: 30 };
export const springSmooth = { type: "spring" as const, stiffness: 300, damping: 25 };
export const springGentle = { type: "spring" as const, stiffness: 200, damping: 22 };

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerContainerSlow = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2 },
};

export const cardTap = { scale: 0.99 };
