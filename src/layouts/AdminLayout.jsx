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
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Logo, LogoIcon } from "./Logo";
import LogoutConfirmModal from "@/components/Common/LogoutConfirmModal";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

   const handleLogout = async () => {
     setLoggingOut(true);
     try {
       await logout();
       navigate("/ops-hub/signin");
     } catch (e) {
       console.error(e);
     } finally {
       setLoggingOut(false);
       setShowLogoutModal(false);
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
      onClick: () => setShowLogoutModal(true),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full h-screen overflow-hidden bg-ui-surface text-neutral-800 dark:text-neutral-100"
      )}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-blue-50 dark:bg-neutral-950 shadow-sm border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300">
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
                      : location.pathname === link.href
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                      : "hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ADMIN PROFILE */}
          <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 px-2 py-3">
              <div
                className={cn(
                  "h-8 w-8 bg-blue-600 min-w-8 shrink-0 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-neutral-200 dark:ring-neutral-700"
                )}
              >
                {getUserInitials()}
              </div>

              {open && (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <main className="flex-1 overflow-hidden px-4 sm:px-3 md:px-4 pt-5 md:pt-2 pb-4 md:py-3">
          <Outlet />
           <LogoutConfirmModal
                    isOpen={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                    loading={loggingOut}
                  />
        </main>
      </div>
    </div>
  );
}
