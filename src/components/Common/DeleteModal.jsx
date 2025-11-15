import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  itemName = "",
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-ui-card rounded-xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground font-montserrat">
            {title}
          </h3>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>This action cannot be undone</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-foreground mb-4">{description}</p>
          {itemName && (
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
              <p className="text-sm font-medium text-foreground">{itemName}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-all bg-red-600 hover:bg-red-700 text-white disabled:opacity-70 shadow hover:shadow-md"
          >
            {loading ? (
              "Deleting..."
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteModal;
