// Paddock's renderDetailItem row (components/modals/*DetailModal.tsx):
// skipped entirely when there is no value.
export function DetailItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number | string[];
  children?: React.ReactNode;
}) {
  const empty =
    children === undefined &&
    (value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0));
  if (empty) return null;

  return (
    <div className="mb-2">
      <span className="font-semibold text-gray-700">{label}: </span>
      {children ?? (
        <span className="text-gray-600">
          {Array.isArray(value) ? value.join(", ") : String(value)}
        </span>
      )}
    </div>
  );
}
