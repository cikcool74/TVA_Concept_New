import clsx from "clsx";

export function PixelCard({ children, className = "" }) {
  return (
    <div
      className={clsx(
        "rounded-xl border-2 border-border bg-card/80 shadow-glow p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
