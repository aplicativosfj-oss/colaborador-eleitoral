import { cn } from "@/lib/utils";

/**
 * Official flag of Acre (Lei nº 1.170/1995), traced from the source SVG on
 * Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Bandeira_do_Acre.svg
 */
export function AcreFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 350"
      className={cn("w-6 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10", className)}
      role="img"
      aria-label="Bandeira do Acre"
    >
      <path d="M0,0H500V350H0" fill="#008F4C" />
      <path d="M0,0H500L0,350" fill="#FDEA02" />
      <path d="M75,25 104,115 27,60H123L46,115" fill="#ED1C24" />
    </svg>
  );
}
