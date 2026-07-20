import {
  HandHeart,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { resetDemo, signOut } from "../lib/store";
import DemoRibbon from "./DemoRibbon";

const navItems = [
  { to: "/coordinator", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/coordinator/providers", label: "Micro-providers", icon: UsersRound },
  { to: "/coordinator/clients", label: "Clients", icon: UserRound },
  { to: "/coordinator/volunteers", label: "Volunteers", icon: HandHeart },
  { to: "/coordinator/compliance", label: "Compliance", icon: ShieldCheck },
];

export default function Shell() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleReset = () => {
    if (window.confirm("Clear every request and client created in this demo?")) {
      resetDemo();
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <DemoRibbon />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="flex flex-col border-b border-pk-line bg-pk-mist md:w-60 md:shrink-0 md:border-r md:border-b-0">
          <div className="px-5 pt-5 pb-4">
            <NavLink to="/" className="block leading-tight">
              <p className="font-display text-xl font-bold tracking-tight">
                Paddock
              </p>
              <p className="mt-0.5 font-plex text-[11px] leading-snug text-pk-slate">
                for Wells Community Network
              </p>
            </NavLink>
          </div>
          <nav
            aria-label="Main"
            className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0"
          >
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-pk-blue-soft font-medium text-pk-blue-deep"
                      : "text-pk-slate hover:bg-pk-fog hover:text-pk-ink"
                  }`
                }
              >
                <Icon size={17} aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden border-t border-pk-line px-5 py-4 md:block">
            <p className="font-plex text-[11px] text-pk-slate">
              Signed in as <span className="text-pk-ink">wells</span>
            </p>
            <div className="mt-2 flex flex-col items-start gap-1.5">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs text-pk-slate hover:text-pk-ink"
              >
                <LogOut size={13} aria-hidden /> Sign out
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-pk-slate hover:text-pk-clay"
              >
                <RotateCcw size={13} aria-hidden /> Reset demo data
              </button>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
