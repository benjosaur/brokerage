import { X } from "lucide-react";
import { useEffect } from "react";

// Dependency-free stand-in for Paddock's radix Dialog (components/ui/
// dialog.tsx), matching its overlay and panel styling.

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className = "" }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-gray-200/60 bg-white p-6 shadow-lg ${className}`}
      >
        {children}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl leading-none font-bold text-transparent">
      {children}
    </h2>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}
