import { motion } from "motion/react";
export const Logo = () => (
  <a className="flex font-bold items-center space-x-3 text-neutral-900 dark:text-white text-lg cursor-pointer group">
    <img
      src="/logo.png"
      className="h-7 w-7 rounded-lg  flex items-center justify-center group-hover:shadow-lg transition-shadow"
    />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tracking-tight"
    >
    MEDISYS
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a className="flex items-center justify-center text-neutral-900 dark:text-white cursor-pointer group">
    <img src="/logo.png" className="h-7 w-7 rounded-lg  flex items-center justify-center group-hover:shadow-lg transition-shadow" />
  </a>
);
