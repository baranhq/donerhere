export function filterOption(active: boolean) {
  return `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${active ? "bg-[#ff5a1e] font-semibold text-white" : "text-stone-800 hover:bg-white/70"}`;
}
export const filterPanel = "rounded-[15px] bg-gray-100 p-3";
export const filterHeading =
  "px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-stone-500";
