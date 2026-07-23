import { ArrowRight, Home } from "lucide-react";
import { Link } from "react-router";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ServiceBadgeList } from "../components/badges";
import { pageTitle, secondaryButton } from "../components/tableStyles";
import { expiryStatus, formatDate, isWithinLastDays } from "../lib/dates";
import { useDemoData } from "../lib/store";

export default function CoordinatorHome() {
  const { providers, clients, volunteers, requests } = useDemoData();

  const dbsDue = [
    ...providers.map((provider) => provider.dbsExpiry),
    ...volunteers.map((volunteer) => volunteer.dbsExpiry),
  ].filter((date) => expiryStatus(date) !== "valid").length;

  const liabilityDue = providers
    .map((provider) => provider.publicLiabilityExpiry)
    .filter((date) => expiryStatus(date) !== "valid").length;

  const newThisWeek = clients.filter((client) =>
    isWithinLastDays(client.onboarded, 7),
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={pageTitle}>Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            {requests.length === 0
              ? "No new support requests waiting."
              : `${requests.length} support request${requests.length === 1 ? "" : "s"} in the book.`}
          </p>
        </div>
        <Link to="/" className={secondaryButton}>
          <Home size={15} aria-hidden />
          Back to home
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCounter
          targetValue={dbsDue}
          label="DBS Renewals Due (90 Days)"
        />
        <AnimatedCounter
          targetValue={liabilityDue}
          label="Public Liability Due (90 Days)"
        />
        <AnimatedCounter targetValue={clients.length} label="Total Clients" />
        <AnimatedCounter
          targetValue={newThisWeek}
          label="New Clients This Week"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Requests
        </h2>
        {requests.length === 0 ? (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md">
            <p className="text-sm text-gray-600">
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
                  className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      {request.locality} · {formatDate(request.createdAt)} ·{" "}
                      {request.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
                      View matches <ArrowRight size={13} aria-hidden />
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-semibold text-gray-800">
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
