import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  pageTitle,
  tableCard,
  tableEl,
  tbodyEl,
  tdEl,
  theadEl,
} from "./tableStyles";

// Read-only port of Paddock's DataTable
// (client/src/components/tables/DataTable.tsx): title + Total pill, search,
// sortable headers, a per-column filter row. The demo drops the CRUD row
// actions, permission gates and admin column visibility.

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  /** Searchable text for cells whose render isn't a plain string (pills). */
  text?: (item: T) => string;
  sortValue?: (item: T) => string | number | null;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title: string;
  searchPlaceholder: string;
  customActions?: React.ReactNode;
  defaultSortKey?: string;
  defaultSortDirection?: "asc" | "desc";
}

const EMPTY_VALUES = new Set([
  "",
  "n/a",
  "no dbs",
  "no public liability",
  "unknown",
  "ongoing",
]);

function isEmptyValue(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && EMPTY_VALUES.has(v.toLowerCase().trim()))
    return true;
  return false;
}

const inputEl =
  "flex h-10 w-full rounded-lg border border-gray-200/70 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 ease-in-out placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 focus-visible:border-blue-300/60 hover:border-gray-300/80";

const thSortable =
  "px-6 py-4 text-left text-sm font-semibold text-gray-800 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100/50 transition-colors duration-150";

export function DataTable<T extends { id: string }>({
  data,
  columns,
  title,
  searchPlaceholder,
  customActions,
  defaultSortKey,
  defaultSortDirection = "asc",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );
  const [sortKey, setSortKey] = useState<string>(
    defaultSortKey ?? (columns[0]?.key || ""),
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection,
  );

  const cellText = (col: TableColumn<T>, row: T): string => {
    if (col.text) return col.text(row);
    const rendered = col.render(row);
    return typeof rendered === "string" || typeof rendered === "number"
      ? String(rendered)
      : "";
  };

  const matches = (col: TableColumn<T>, row: T, term: string): boolean =>
    cellText(col, row).toLowerCase().includes(term.toLowerCase());

  const filteredData = data.filter((row) => {
    const matchesSearch =
      searchTerm === "" || columns.some((col) => matches(col, row, searchTerm));

    const matchesColumnFilters = Object.entries(columnFilters).every(
      ([columnKey, filterValue]) => {
        if (filterValue === "") return true;
        const column = columns.find((col) => col.key === columnKey);
        if (!column) return true;
        return matches(column, row, filterValue);
      },
    );

    return matchesSearch && matchesColumnFilters;
  });

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    const sortColumn = columns.find((col) => col.key === sortKey);
    if (!sortColumn) return filteredData;

    const dirFactor = sortDirection === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const aRaw = sortColumn.sortValue
        ? sortColumn.sortValue(a)
        : cellText(sortColumn, a);
      const bRaw = sortColumn.sortValue
        ? sortColumn.sortValue(b)
        : cellText(sortColumn, b);

      // Empty/N/A values always sort to bottom regardless of direction
      const aEmpty = isEmptyValue(aRaw);
      const bEmpty = isEmptyValue(bRaw);
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;

      const aStr = String(aRaw);
      const bStr = String(bRaw);

      const aNum = Number(aStr);
      const bNum = Number(bStr);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return (aNum - bNum) * dirFactor;
      }

      // String comparison (handles YYYY-MM-DD dates correctly via lexicographic order)
      return (
        aStr.localeCompare(bStr, undefined, { sensitivity: "base" }) * dirFactor
      );
    });
  }, [filteredData, sortKey, sortDirection, columns]);

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className={pageTitle}>{title}</h1>
          <span className="rounded-full border border-gray-200/50 bg-gray-100/60 px-3 py-1 text-sm text-gray-500 select-none">
            Total: {filteredData.length}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="group relative select-none">
            <Search className="absolute top-1/2 left-3 z-1 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-colors duration-200 group-focus-within:text-gray-500" />
            <input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`${inputEl} w-72 pl-10 shadow-sm`}
            />
          </div>
          {customActions}
        </div>
      </div>

      <div className={tableCard}>
        <table className={tableEl}>
          <thead className={theadEl}>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  aria-sort={
                    sortKey === col.key
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={`${thSortable} ${index === 0 ? "rounded-tl-xl" : ""} ${
                    index === columns.length - 1 ? "rounded-tr-xl" : ""
                  }`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortKey === col.key ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 text-gray-600" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-gray-600" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
            <tr className="bg-white/70">
              {columns.map((col) => (
                <th key={`filter-${col.key}`} className="px-6 py-2">
                  <input
                    placeholder="Filter..."
                    value={columnFilters[col.key] || ""}
                    onChange={(event) =>
                      setColumnFilters((prev) => ({
                        ...prev,
                        [col.key]: event.target.value,
                      }))
                    }
                    className={`${inputEl} h-8 !font-normal text-xs placeholder:font-normal`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={tbodyEl}>
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className="transition-colors duration-150 ease-in-out hover:bg-gray-100/80"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={`${tdEl} ${
                      index === sortedData.length - 1 && colIndex === 0
                        ? "rounded-bl-xl"
                        : ""
                    } ${
                      index === sortedData.length - 1 &&
                      colIndex === columns.length - 1
                        ? "rounded-br-xl"
                        : ""
                    }`}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
