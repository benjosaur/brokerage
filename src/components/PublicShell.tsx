import { Link, Outlet } from "react-router";
import DemoRibbon from "./DemoRibbon";
import { useSignedIn } from "../lib/store";

/** Slim chrome for the public support-seeker flow (form + results). */
export default function PublicShell() {
  const signedIn = useSignedIn();
  return (
    <div className="flex min-h-full flex-col">
      <DemoRibbon />
      <header className="border-b border-pk-line bg-pk-mist">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between px-4 py-3">
          <Link to="/" className="leading-tight">
            <span className="font-display text-lg font-bold tracking-tight">
              Paddock
            </span>
            <span className="ml-2 font-plex text-[11px] text-pk-slate">
              for Wells Community Network
            </span>
          </Link>
          <Link
            to={signedIn ? "/coordinator" : "/coordinator/login"}
            className="text-xs text-pk-slate hover:text-pk-ink"
          >
            {signedIn ? "Coordinator view" : "Coordinator sign in"}
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
