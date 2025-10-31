import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconStethoscope,
  IconUsersGroup,
  IconCalendarTime,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Logo, LogoIcon } from "./Logo";

export default function AdminLayout({ children }) {
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
    if (!user) return "A";
    if (user.name) {
      const names = user.name.split(" ");
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
    return "A";
  };

  // Sidebar Navigation Links
  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Doctors",
      href: "/admin/doctors",
      icon: (
        <IconStethoscope className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Patients",
      href: "/admin/patients",
      icon: (
        <IconUsersGroup className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Appointments",
      href: "/admin/appointments",
      icon: (
        <IconCalendarTime className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
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
        "flex w-full h-screen overflow-hidden bg-ui-surface text-neutral-800 dark:text-neutral-100"
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 dark:bg-neutral-950 shadow-sm border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
              {open ? <Logo /> : <LogoIcon />}
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick}
                  className={cn(
                    "px-2 py-3 rounded-lg flex items-center gap-2 transition-all duration-200",
                    link.onClick
                      ? "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                      : "hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ADMIN PROFILE – ICON + LABEL (NO CLICK) */}
          <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 px-2 py-3">
              {/* Avatar with "A" */}
              <div
                className={cn(
                  "h-8 w-8 bg-blue-600 min-w-8 shrink-0 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-neutral-200 dark:ring-neutral-700"
                )}
              >
                {getUserInitials()}
              </div>

              {/* Admin Label – only when sidebar is open */}
              {open && (
                <div >
                  <p className="text-sm font-medium text-foreground">
                    Admin
                  </p>
                  
                </div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8">{children}</main>
    </div>
  );
}
