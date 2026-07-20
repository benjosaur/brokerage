import { ArrowRight, PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { Eyebrow, ServiceBadgeList } from "../components/badges";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";
import { LOCALITIES } from "../lib/types";

export default function Home() {
  const { providers, clients, requests } = useDemoData();

  return (
    <div>
      <Eyebrow>Wells Community Network · Brokerage</Eyebrow>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance">
        Support near you.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-pk-slate">
        Match residents of Wells, Shepton Mallet and the surrounding villages
        with accredited local micro-providers — self-employed carers offering
        support at home and in the community.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to="/find-support"
          className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
        >
          <PlusCircle size={16} aria-hidden />
          Start a support request
        </Link>
        <Link
          to="/providers"
          className="inline-flex items-center gap-2 rounded-[10px] border border-pk-line bg-white px-5 py-2.5 text-sm font-medium text-pk-ink transition-colors hover:border-pk-slate/40"
        >
          Browse micro-providers
        </Link>
      </div>

      <p className="mt-6 font-plex text-xs text-pk-slate">
        {providers.length} accredited micro-providers · {LOCALITIES.length}{" "}
        towns &amp; villages · {clients.length} clients supported
      </p>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Recent requests</h2>
        {requests.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-pk-line bg-pk-sand px-6 py-8 text-center">
            <p className="text-sm text-pk-slate">
              No support requests yet. Start one to see how matching works —
              it takes about two minutes.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {requests.map((request) => (
              <li key={request.id}>
                <Link
                  to={`/find-support/results/${request.id}`}
                  className="group block rounded-2xl border border-pk-line bg-white p-5 transition-colors hover:border-pk-blue/40"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-plex text-[11px] tracking-wide text-pk-slate uppercase">
                      {request.locality} · {formatDate(request.createdAt)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-pk-blue group-hover:text-pk-blue-deep">
                      View matches <ArrowRight size={13} aria-hidden />
                    </span>
                  </div>
                  <p className="mt-2 font-display text-[15px] font-semibold text-pk-ink">
                    “{request.headline}”
                  </p>
                  <div className="mt-3">
                    <ServiceBadgeList services={request.services} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
