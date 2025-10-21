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
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Logo, LogoIcon } from "./Logo";

export default function DoctorLayout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";

    if (user.name) {
      const names = user.name.split(" ");
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }

    return "A";
  };

  const links = [
    {
      label: "Dashboard",
      href: "/doctor/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Appointments",
      href: "/doctor/appointments",
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
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full h-screen overflow-hidden bg-ui-surface"
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
                  onClick={link.onClick}
                  className={cn(
                    "px-1 py-3 rounded-lg transition-colors duration-200",
                    link.onClick
                      ? "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                      : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  )}
                />
              ))}
            </div>
          </div>

          {/* User Profile Section with enhanced styling */}
          <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <SidebarLink
              link={{
                label: user?.name || user?.username || "Admin",
                href: "/profile",
                icon: (
                  <div
                    className={cn(
                      "h-8 w-8 bg-blue-600 min-w-8 shrink-0 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-neutral-200 dark:ring-neutral-700"
                    )}
                  >
                    {getUserInitials()}
                  </div>
                ),
              }}
              className="py-3 px-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Page content with refined styling */}
      <main className="flex-1 overflow-hidden px-8 py-5">
        {/* <div className="flex h-full w-full flex-1 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-8 dark:border-neutral-800 dark:bg-neutral-900"> */}
          {children}
        {/* </div> */}
      </main>
    </div>
  );
}
