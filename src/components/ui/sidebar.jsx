"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-2 py-4 hidden md:flex md:flex-col bg-white dark:bg-neutral-950 w-[300px] shrink-0 overflow-hidden",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className={cn(
          "h-16 px-4 py-4 flex md:hidden items-center justify-between bg-blue-50 dark:bg-neutral-950 w-full border-b border-neutral-200 dark:border-neutral-800 fixed top-0 left-0 right-0 z-40"
        )}
        {...props}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {props.userInitials || "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {props.userName || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200 h-6 w-6"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-80 inset-y-0 left-0 bg-white dark:bg-neutral-950 p-6 z-50 flex flex-col justify-between md:hidden",
                className
              )}
            >
              {/* Close Button */}
              <div className="absolute right-6 top-6 z-50">
                <IconX
                  className="h-6 w-6 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Sidebar Content */}
              <div className="flex flex-col flex-1 overflow-y-auto mt-8">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({ link, className, onClick, ...props }) => {
  const { open, animate } = useSidebar();
  const { setOpen } = useSidebar();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    // Close mobile sidebar after navigation
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-3 w-full text-left",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-800 dark:text-neutral-200 text-md group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </button>
  );
};
