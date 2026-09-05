import { cn } from "@/lib/utils";

export function StarEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path d="M12 1.5 14.9 9h7.6l-6.15 4.47L18.75 21 12 16.36 5.25 21l2.4-7.53L1.5 9h7.6L12 1.5Z" />
    </svg>
  );
}
