import { ArrowRight, PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { Eyebrow, ServiceBadgeList } from "../components/badges";
import { expiryStatus } from "../lib/dates";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";

export default function CoordinatorHome() {
  const { providers, clients, volunteers, requests } = useDemoData();

  const attention = providers.filter(
    (provider) =>
      expiryStatus(provider.dbsExpiry) !== "valid" ||
      expiryStatus(provider.liabilityExpiry) !== "valid",
  ).length;

  return (
    <div>
      <Eyebrow>Coordinator overview</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Good day, Wells.
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-pk-slate">
        {requests.length === 0
          ? "No new support requests waiting."
          : `${requests.length} support request${requests.length === 1 ? "" : "s"} in the book.`}{" "}
        {providers.length} accredited micro-providers, {clients.length}{" "}
        clients and {volunteers.length} volunteers on file.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to="/find-support"
          className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
        >
          <PlusCircle size={16} aria-hidden />
          Start a support request
        </Link>
        {attention > 0 && (
          <Link
            to="/coordinator/compliance"
            className="inline-flex items-center gap-2 rounded-[10px] border border-pk-amber/40 bg-pk-amber-soft px-5 py-2.5 text-sm font-medium text-pk-amber transition-colors hover:border-pk-amber"
          >
            {attention} provider{attention === 1 ? "" : "s"} need
            {attention === 1 ? "s" : ""} a compliance check
          </Link>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Recent requests</h2>
        {requests.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-pk-line bg-pk-sand px-6 py-8 text-center">
            <p className="text-sm text-pk-slate">
              Nothing yet. Requests submitted through Find Support appear
              here the moment they arrive.
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
                      {request.locality} · {formatDate(request.createdAt)} ·{" "}
                      {request.name}
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
