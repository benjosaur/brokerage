import { Toaster as HotToaster } from "react-hot-toast";

// Paddock's Toaster (components/ui/Toaster.tsx) minus the copilot capture,
// with its theme variables resolved to the demo's palette.
export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
        },
        success: {
          duration: 3000,
          style: {
            background: "#ffffff",
            border: "1px solid #22c55e",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#ffffff",
            border: "1px solid #ef4444",
          },
        },
      }}
    />
  );
}
