import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; 
import { Logo, LogoIcon } from "./Logo";
import { ListCollapse } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // For active link highlighting

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

  const handleLogout = async () => {
    try {
      await logout();
      // Optional: navigate("/login") or similar
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Appointments",
      href: "/appointments",
      icon: (
        <IconUserBolt className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
      ),
    },
    {
      label: "Medical Records",
      href: "/records",
      icon: (
        <ListCollapse className="h-5 w-5 min-w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-300" />
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
    <div className={cn("flex w-full h-screen overflow-hidden bg-ui-surface")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody
          className={cn(
            "justify-between gap-10 bg-blue-50 dark:bg-neutral-950 border-r-2 border-neutral-200 dark:border-neutral-800 transition-all duration-300"
          )}
        >
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Logo Section */}
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
                    "px-2.5 py-3 rounded-lg transition-colors duration-200",
                    link.onClick
                      ? "hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                      : location.pathname === link.href
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                      : "hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400"
                  )}
                />
              ))}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <SidebarLink
              link={{
                label: user?.name || user?.username || "Patient",
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

      <main className="flex-1 overflow-y-auto p-2 md:p-4">
        {/* <div className="flex h-full w-full flex-1 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 md:p-8 dark:border-neutral-800 dark:bg-neutral-900"> */}
          {children}
        {/* </div> */}
      </main>
    </div>
  );
}
