import { ServiceBadgeList } from "../components/badges";
import {
  pageTitle,
  tableCard,
  tableEl,
  tbodyEl,
  tdEl,
  thEl,
  theadEl,
} from "../components/tableStyles";
import { formatDate } from "../lib/dates";
import { useDemoData } from "../lib/store";
import type { Client } from "../lib/types";

const statusStyles: Record<Client["status"], string> = {
  Active: "bg-green-100 text-green-800",
  Matched: "bg-blue-100 text-blue-800",
  "New request": "bg-amber-100 text-amber-800",
};

export default function Clients() {
  const { clients } = useDemoData();

  return (
    <div>
      <h1 className={pageTitle}>Clients</h1>
      <p className="mt-1 text-sm text-gray-600">
        {clients.length} people supported through the network, including
        anyone onboarded via Find Support in this demo.
      </p>

      <div className={`mt-5 ${tableCard}`}>
        <table className={tableEl}>
          <thead className={theadEl}>
            <tr>
              <th className={thEl}>Name</th>
              <th className={thEl}>Locality</th>
              <th className={thEl}>Services</th>
              <th className={thEl}>Onboarded</th>
              <th className={thEl}>Status</th>
            </tr>
          </thead>
          <tbody className={tbodyEl}>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50/60">
                <td className={`${tdEl} font-medium text-gray-800`}>
                  {client.name}
                  <p className="mt-0.5 max-w-sm text-xs font-normal text-gray-500">
                    “{client.headline}”
                  </p>
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {client.locality}
                </td>
                <td className={tdEl}>
                  <ServiceBadgeList services={client.services} />
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {formatDate(client.onboarded)}
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[client.status]}`}
                  >
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
