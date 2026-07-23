import { createContext, useContext, useEffect, useRef, useState } from "react";

// Port of Paddock's dependency-free dropdown (components/ui/dropdown-menu.tsx).

const DropdownMenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative" ref={dropdownRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);

  return (
    <button
      type="button"
      {...props}
      onClick={() => setIsOpen(!isOpen)}
      className="flex h-8 w-8 transform cursor-pointer items-center justify-center rounded-lg border border-gray-200/60 bg-white/80 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-gray-300/70 hover:bg-gray-50/90 active:scale-95"
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useContext(DropdownMenuContext);

  if (!isOpen) return null;

  return (
    <div className="animate-in absolute top-full right-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-gray-200/60 bg-white/95 p-1 shadow-xl shadow-gray-900/10 backdrop-blur-lg">
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { setIsOpen } = useContext(DropdownMenuContext);

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        setIsOpen(false);
      }}
      className="relative flex w-full transform cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none select-none transition-all duration-150 ease-in-out hover:bg-gray-100/80 hover:text-gray-900 focus:bg-gray-100/80 focus:text-gray-900 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
