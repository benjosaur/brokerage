import { Search } from "lucide-react";
import { useState } from "react";
import { ExpiryChip, ServiceBadgeList } from "../components/badges";
import {
  pageTitle,
  tableCard,
  tableEl,
  tbodyEl,
  tdEl,
  thEl,
  theadEl,
} from "../components/tableStyles";
import { useDemoData } from "../lib/store";

export default function Providers() {
  const { providers } = useDemoData();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const filtered = providers.filter((provider) =>
    [provider.name, provider.locality, ...provider.services]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );

  return (
    <div>
      <h1 className={pageTitle}>Micro-providers</h1>
      <p className="mt-1 text-sm text-gray-600">
        {providers.length} accredited micro-providers on the network.
      </p>

      <div className="group relative mt-5 max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-gray-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, village or service…"
          aria-label="Search micro-providers"
          className="w-full rounded-xl border border-gray-200/60 bg-white/80 py-2 pr-4 pl-10 text-sm shadow-sm backdrop-blur-sm placeholder:text-gray-400"
        />
      </div>

      <div className={`mt-5 ${tableCard}`}>
        <table className={tableEl}>
          <thead className={theadEl}>
            <tr>
              <th className={thEl}>Name</th>
              <th className={thEl}>Locality</th>
              <th className={thEl}>Services</th>
              <th className={thEl}>Availability</th>
              <th className={thEl}>DBS</th>
              <th className={thEl}>Public Liability</th>
            </tr>
          </thead>
          <tbody className={tbodyEl}>
            {filtered.length === 0 ? (
              <tr>
                <td className={tdEl} colSpan={6}>
                  No micro-provider matches “{query}”. Try a village or a
                  service like “garden”.
                </td>
              </tr>
            ) : (
              filtered.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50/60">
                  <td
                    className={`${tdEl} font-medium whitespace-nowrap text-gray-800`}
                    title={provider.bio}
                  >
                    {provider.name}
                  </td>
                  <td className={`${tdEl} whitespace-nowrap`}>
                    {provider.locality} · {provider.outwardPostcode}
                  </td>
                  <td className={tdEl}>
                    <ServiceBadgeList services={provider.services} />
                  </td>
                  <td className={`${tdEl} min-w-40 text-xs text-gray-500`}>{provider.availability}</td>
                  <td className={`${tdEl} whitespace-nowrap`}>
                    <ExpiryChip date={provider.dbsExpiry} />
                  </td>
                  <td className={`${tdEl} whitespace-nowrap`}>
                    <ExpiryChip
                      
                      date={provider.publicLiabilityExpiry}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
