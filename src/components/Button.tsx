// Paddock's Button (components/ui/button.tsx), reduced to the variants the
// demo uses.
const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] h-10 px-4 py-2";

const variants = {
  default:
    "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md shadow-blue-500/20 hover:shadow-blue-500/30",
  destructive:
    "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md shadow-red-500/20 hover:shadow-red-500/30",
  outline:
    "border border-gray-200/60 bg-white/80 hover:bg-gray-50/90 hover:border-gray-300/70 text-gray-700 shadow-sm hover:shadow-md",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({
  variant = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
