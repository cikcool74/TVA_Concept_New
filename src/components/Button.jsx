import clsx from "clsx";

const variants = {
  primary: "bg-neon text-white border-pink-700 hover:bg-pink-500",
  secondary: "bg-gray-800 text-gray-200 border-gray-700 hover:border-gray-500",
  success: "bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500",
  accent: "bg-accent text-black border-yellow-600 hover:bg-yellow-400",
};

export function Button({ children, variant = "secondary", className = "", ...props }) {
  return (
    <button
      className={clsx(
        "rounded border-b-4 px-4 py-2 text-sm font-bold uppercase transition-all active:translate-y-1 active:border-b-0",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
