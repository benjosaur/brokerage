import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import DemoRibbon from "../components/DemoRibbon";
import { Eyebrow } from "../components/badges";
import { signIn } from "../lib/store";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (username.trim().toLowerCase() !== "wells") {
      setError("This demo signs in as “wells”. Try that username.");
      return;
    }
    if (!password) {
      setError("Enter any password; it isn’t checked in the demo.");
      return;
    }
    signIn();
    navigate("/coordinator");
  };

  return (
    <div className="flex min-h-full flex-col">
      <DemoRibbon />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-pk-slate hover:text-pk-ink"
        >
          <ArrowLeft size={13} aria-hidden /> Back
        </Link>
        <p className="mt-4 font-display text-2xl font-bold tracking-tight">
          Paddock
        </p>
        <p className="mt-1 font-plex text-xs text-pk-slate">
          for Wells Community Network
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-pk-line bg-white p-6 shadow-[0_12px_30px_rgba(28,39,51,0.06)]"
        >
          <Eyebrow>Coordinator sign in</Eyebrow>
          <label className="mt-4 block text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-pk-line bg-pk-paper px-3 py-2 text-sm placeholder:text-pk-slate/60"
            placeholder="wells"
          />
          <label className="mt-4 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-pk-line bg-pk-paper px-3 py-2 text-sm"
          />
          {error && <p className="mt-3 text-sm text-pk-clay">{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-[10px] bg-pk-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
          >
            Sign in
          </button>
          <p className="mt-4 text-center font-plex text-[11px] text-pk-slate">
            Demo login: username <span className="text-pk-ink">wells</span>,
            any password.
          </p>
        </form>
        </div>
      </main>
    </div>
  );
}
