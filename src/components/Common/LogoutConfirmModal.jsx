import { X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl bg-ui-card p-6 shadow-xl",
          "animate-in fade-in zoom-in duration-200"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Confirm Logout
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to log out? You will be redirected to the login
          page.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={cn(
              "flex-1 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700",
              "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 py-2 rounded-lg bg-red-600 text-white flex items-center justify-center gap-2",
              "hover:bg-red-700 transition",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="animate-pulse">Logging out…</span>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
