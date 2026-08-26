import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** ReactBits-style animated gradient text. */
export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("gradient-text", className)}>{children}</span>;
}
