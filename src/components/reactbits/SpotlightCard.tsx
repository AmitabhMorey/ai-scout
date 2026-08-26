import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** ReactBits-style spotlight card: a radial glow follows the cursor. */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
        el.style.setProperty("--spot-opacity", "1");
      }}
      onMouseLeave={() => ref.current?.style.setProperty("--spot-opacity", "0")}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  );
}
