import { CheckCircle2, Info, Mail, MapPin } from "lucide-react";
import { Link, useParams } from "react-router";
import { Eyebrow, ExpiryChip, ServiceBadgeList } from "../components/badges";
import { formatDate } from "../lib/dates";
import { buildMailto } from "../lib/mailto";
import { matchProviders } from "../lib/matching";
import { useDemoData } from "../lib/store";

export default function Results() {
  const { requestId } = useParams<{ requestId: string }>();
  const { providers, requests } = useDemoData();
  const request = requests.find((entry) => entry.id === requestId);

  if (!request) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-2xl font-bold">Request not found</h1>
        <p className="mt-2 text-sm text-pk-slate">
          This request may have been cleared when the demo data was reset.
        </p>
        <Link
          to="/find-support"
          className="mt-5 inline-flex rounded-[10px] bg-pk-blue px-4 py-2.5 text-sm font-medium text-white hover:bg-pk-blue-deep"
        >
          Start a new request
        </Link>
      </div>
    );
  }

  const matches = matchProviders(providers, request);
  const canEmail = request.consentWcnNetwork;

  return (
    <div>
      <div className="flex items-start gap-3 rounded-2xl border border-pk-leaf/25 bg-pk-leaf-soft p-4">
        <CheckCircle2 className="mt-0.5 shrink-0 text-pk-leaf" size={18} aria-hidden />
        <p className="text-sm leading-relaxed text-pk-leaf">
          <span className="font-semibold">Request received.</span> In the live
          service WCN processes requests within three working days — in this
          demo, the matches are ready now.
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-pk-line bg-pk-sand p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Eyebrow>
            Support notice · {request.locality} · {formatDate(request.createdAt)}
          </Eyebrow>
          <span className="font-plex text-[11px] text-pk-slate">
            ref {request.id}
          </span>
        </div>
        <blockquote className="mt-3 font-display text-2xl font-bold tracking-tight text-balance">
          “{request.headline}”
        </blockquote>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ServiceBadgeList services={request.services} />
          {request.hasPets && (
            <span className="rounded-full bg-pk-fog px-2.5 py-0.5 text-xs text-pk-slate">
              Pets at home
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-pk-slate">
          <span className="font-medium text-pk-ink">When:</span>{" "}
          {request.schedule}
        </p>
      </section>

      {!canEmail && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-pk-amber/30 bg-pk-amber-soft p-4">
          <Info className="mt-0.5 shrink-0 text-pk-amber" size={18} aria-hidden />
          <p className="text-sm leading-relaxed text-pk-amber">
            Sharing consent wasn’t given on this request, so provider emails
            are switched off. WCN would contact you first to talk through the
            options.
          </p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">
          {matches.length === 0
            ? "No matching micro-providers right now"
            : `${matches.length} matching micro-provider${matches.length === 1 ? "" : "s"}`}
        </h2>
        {matches.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-pk-line bg-pk-sand px-6 py-8">
            <p className="text-sm leading-relaxed text-pk-slate">
              No one currently covers {request.locality} for that mix of
              support. The WCN Helpline (01749 467079) keeps a waiting list
              and can widen the search to nearby networks.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {matches.map(({ provider, overlap, sameLocality }, index) => (
              <li
                key={provider.id}
                className="animate-rise rounded-2xl border border-pk-line bg-white p-5 shadow-[0_8px_24px_rgba(28,39,51,0.04)]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {provider.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 font-plex text-[12px] text-pk-slate">
                      <MapPin size={12} aria-hidden />
                      {provider.locality} · {provider.outwardPostcode}
                      {sameLocality && (
                        <span className="ml-1.5 rounded-full bg-pk-blue-soft px-2 py-0.5 text-[11px] font-medium text-pk-blue-deep">
                          Same village
                        </span>
                      )}
                    </p>
                  </div>
                  {request.services.length > 0 && (
                    <span className="font-plex text-[11px] text-pk-slate">
                      {overlap.length} of {request.services.length} services
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pk-slate">
                  {provider.bio}
                </p>
                <p className="mt-2 font-plex text-[12px] text-pk-slate">
                  {provider.availability}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <ServiceBadgeList services={provider.services} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-pk-line pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    <ExpiryChip label="DBS" date={provider.dbsExpiry} />
                    <ExpiryChip
                      label="Insurance"
                      date={provider.liabilityExpiry}
                    />
                  </div>
                  {canEmail ? (
                    <a
                      href={buildMailto(provider, request)}
                      className="inline-flex items-center gap-2 rounded-[10px] bg-pk-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pk-blue-deep"
                    >
                      <Mail size={15} aria-hidden />
                      Draft email
                    </a>
                  ) : (
                    <span
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] bg-pk-fog px-4 py-2 text-sm font-medium text-pk-slate"
                      title="No sharing consent on this request"
                    >
                      <Mail size={15} aria-hidden />
                      Draft email
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-pk-line pt-6">
        <Link
          to="/find-support"
          className="inline-flex items-center rounded-[10px] border border-pk-line bg-white px-4 py-2.5 text-sm font-medium hover:border-pk-slate/40"
        >
          Start another request
        </Link>
        <Link to="/" className="inline-flex items-center px-2 py-2.5 text-sm text-pk-slate hover:text-pk-ink">
          Back to home
        </Link>
      </div>
    </div>
  );
}
