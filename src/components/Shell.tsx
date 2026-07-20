import { LogOut, Menu, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { resetDemo, signOut } from "../lib/store";
import DemoRibbon from "./DemoRibbon";

// Coordinator chrome mirrors the live Paddock app shell
// (client/src/App.tsx + components/Sidebar.tsx).
const menuItems = [
  { key: "overview", label: "Dashboard", path: "/coordinator" },
  { key: "providers", label: "Micro-providers", path: "/coordinator/providers" },
  { key: "clients", label: "Clients", path: "/coordinator/clients" },
  { key: "volunteers", label: "Volunteers", path: "/coordinator/volunteers" },
  { key: "compliance", label: "Compliance", path: "/coordinator/compliance" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-3">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white"
      >
        W
      </span>
      <span className="text-lg font-bold text-gray-800">Paddock</span>
    </div>
  );
}

export default function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleReset = () => {
    if (window.confirm("Clear every request and client created in this demo?")) {
      resetDemo();
    }
  };

  const content = (
    <>
      <Brand />
      <div className="mt-1 px-3">
        <span className="text-xs text-gray-500">
          for Wells Community Network
        </span>
      </div>
      <div className="mt-3 mb-4 px-3">
        <span className="inline-block rounded-full bg-gray-200/70 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
          Coordinator
        </span>
      </div>

      <nav className="flex flex-1 flex-col space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`block w-full px-3 py-2.5 text-left text-sm select-none rounded-md transition-colors duration-150 ease-in-out ${
              location.pathname === item.path
                ? "bg-gray-200/70 font-medium text-gray-900"
                : "text-gray-600 hover:bg-gray-100/70 hover:text-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleReset}
        className="mt-3 flex w-full cursor-pointer items-center space-x-2 rounded-md px-3 pt-2 text-sm text-gray-600 transition-colors duration-150 ease-in-out hover:text-gray-800"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset demo data</span>
      </button>
      <button
        onClick={handleSignOut}
        className="mt-1 flex w-full cursor-pointer items-center space-x-2 rounded-md border-t border-gray-200/60 px-3 pt-4 pb-2.5 text-sm text-gray-600 transition-colors duration-150 ease-in-out hover:text-gray-800"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </button>
    </>
  );

  return (
    <div className="flex h-screen flex-col">
      <DemoRibbon />
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-br from-gray-50 to-gray-100/30 md:flex-row">
        {/* Mobile top bar */}
        <header className="flex items-center gap-2 border-b border-gray-200/60 bg-white/90 px-3 py-2.5 backdrop-blur-sm md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white"
          >
            W
          </span>
          <span className="font-bold text-gray-800">Paddock</span>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-gray-900/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 left-0 flex w-64 flex-col bg-gray-50 p-4 shadow-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="mb-2 self-end rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
              {content}
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden w-52 flex-col border-r border-gray-200/60 bg-gradient-to-b from-gray-50/90 to-gray-100/80 p-4 backdrop-blur-sm md:flex">
          {content}
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
