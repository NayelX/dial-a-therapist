export const springTransition = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 };
export const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
export const fadeUpVariant = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: springTransition } };
