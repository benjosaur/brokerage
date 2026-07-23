import { useState } from "react";

// Minimal stand-in for Paddock's shadcn Tabs (components/ui/tabs.tsx),
// matching its full-width segmented look.
export function Tabs({
  tabs,
  contentClassName = "mt-6",
}: {
  tabs: { label: string; content: React.ReactNode }[];
  contentClassName?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="grid h-9 w-full items-center justify-center rounded-lg bg-gray-100 p-[3px] text-gray-500 select-none"
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={`inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] ${
              index === active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={contentClassName}>{tabs[active]?.content}</div>
    </div>
  );
}
