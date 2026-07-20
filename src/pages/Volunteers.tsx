import { ExpiryChip } from "../components/badges";
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

export default function Volunteers() {
  const { volunteers } = useDemoData();

  return (
    <div>
      <h1 className={pageTitle}>Volunteers</h1>
      <p className="mt-1 text-sm text-gray-600">
        The {volunteers.length}-strong helpline and liaison team behind the
        brokerage service.
      </p>

      <div className={`mt-5 ${tableCard}`}>
        <table className={tableEl}>
          <thead className={theadEl}>
            <tr>
              <th className={thEl}>Name</th>
              <th className={thEl}>Role</th>
              <th className={thEl}>Locality</th>
              <th className={thEl}>Contact</th>
              <th className={thEl}>Volunteering Since</th>
              <th className={thEl}>DBS</th>
            </tr>
          </thead>
          <tbody className={tbodyEl}>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id} className="hover:bg-gray-50/60">
                <td className={`${tdEl} font-medium text-gray-800`}>
                  {volunteer.name}
                </td>
                <td className={tdEl}>{volunteer.role}</td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {volunteer.locality}
                </td>
                <td className={tdEl}>
                  {volunteer.email}
                  <p className="mt-0.5 text-xs text-gray-500">
                    {volunteer.phone}
                  </p>
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  {formatDate(volunteer.since)}
                </td>
                <td className={`${tdEl} whitespace-nowrap`}>
                  <ExpiryChip date={volunteer.dbsExpiry} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
