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
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconArrowLeft className="h-5 w-5" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full h-screen overflow-hidden bg-white dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "/profile",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>

      {/* Page content here */}
      <main className="flex-1 overflow-y-auto p-1 bg-gray-100">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-gray-300 bg-white p-2 md:p-5 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </main>
    </div>
  );
}

const Logo = () => (
  <a className="flex items-center space-x-2 text-black dark:text-white">
    <div className="h-5 w-6 rounded-lg bg-black dark:bg-white" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Acet Labs
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a className="flex items-center space-x-2 text-black dark:text-white">
    <div className="h-5 w-6 rounded-lg bg-black dark:bg-white" />
  </a>
);
