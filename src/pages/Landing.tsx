import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import DemoRibbon from "../components/DemoRibbon";
import { Eyebrow } from "../components/badges";
import { useDemoData } from "../lib/store";

export default function Landing() {
  const { providers } = useDemoData();

  return (
    <div className="flex min-h-full flex-col">
      <DemoRibbon />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12">
        <p className="font-display text-2xl font-bold tracking-tight">
          Paddock
        </p>
        <p className="mt-1 font-plex text-xs text-pk-slate">
          for Wells Community Network
        </p>

        <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Support near you.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-pk-slate">
          Connecting residents of Wells, Shepton Mallet and the surrounding
          villages with {providers.length} accredited local micro-providers —
          self-employed carers offering support at home and in the community.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            to="/find-support"
            className="group rounded-2xl border border-pk-line bg-white p-6 shadow-[0_12px_30px_rgba(28,39,51,0.05)] transition-colors hover:border-pk-blue/50"
          >
            <HeartHandshake className="text-pk-blue" size={26} aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">
              I’m looking for a micro-provider
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-pk-slate">
              Tell us about the support you need and see matched local
              carers. Takes about two minutes — no account needed.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pk-blue group-hover:text-pk-blue-deep">
              Find support <ArrowRight size={15} aria-hidden />
            </span>
          </Link>

          <Link
            to="/coordinator"
            className="group rounded-2xl border border-pk-line bg-white p-6 shadow-[0_12px_30px_rgba(28,39,51,0.05)] transition-colors hover:border-pk-blue/50"
          >
            <ShieldCheck className="text-pk-leaf" size={26} aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">
              I’m a WCN coordinator
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-pk-slate">
              Review incoming requests and manage micro-providers, clients,
              volunteers and compliance.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pk-blue group-hover:text-pk-blue-deep">
              Open coordinator view
              <ArrowRight size={15} aria-hidden />
            </span>
          </Link>
        </div>

        <div className="mt-10">
          <Eyebrow>WCN Helpline · 01749 467079</Eyebrow>
        </div>
      </main>
    </div>
  );
}
