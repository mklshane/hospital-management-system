import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo Section with better spacing */}
            <div className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
              {open ? <Logo /> : <LogoIcon />}
            </div>

            {/* Navigation Links with improved spacing */}
            <div className="flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className="px-1 py-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
                />
              ))}
            </div>
          </div>

          {/* User Profile Section with enhanced styling */}
          <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "/profile",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-8 w-8 min-w-8 shrink-0 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 object-cover"
                    alt="Avatar"
                  />
                ),
              }}
              className="py-3 px-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Page content with refined styling */}
      <main className="flex-1 overflow-y-auto p-2 md:p-4">
        <div className="flex h-full w-full flex-1 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-8 dark:border-neutral-800 dark:bg-neutral-900">
          {children}
        </div>
      </main>
    </div>
  );
}

const Logo = () => (
  <a className="flex items-center space-x-3 text-neutral-900 dark:text-white font-semibold text-lg cursor-pointer group">
    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tracking-tight"
    >
      Acet Labs
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a className="flex items-center justify-center text-neutral-900 dark:text-white cursor-pointer group">
    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow" />
  </a>
);
