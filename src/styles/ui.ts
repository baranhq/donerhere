// Shared Tailwind recipes for repeated layouts and controls.
export const ui = {
  page: "mx-auto max-w-[1200px] px-5 pt-8 pb-14 max-[700px]:px-3.5 max-[700px]:pt-6 max-[700px]:pb-10 [&_h1]:mb-4 [&_h1]:text-[clamp(1.7rem,4vw,2.4rem)] [&_h1]:font-[750] [&_h2]:mb-3 [&_h2]:text-[1.35rem] [&_h2]:font-bold [&_h3]:font-bold [&_p]:my-2.5 [&_p]:wrap-anywhere [&_p:empty]:hidden [&_label]:flex [&_label]:flex-col [&_label]:gap-1.5 [&_label]:font-semibold [&_input]:w-full [&_input]:min-w-0 [&_input]:rounded-lg [&_input]:border [&_input]:border-[#9a7e71] [&_input]:bg-white [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-[#211c19] [&_select]:w-full [&_select]:min-w-0 [&_select]:rounded-lg [&_select]:border [&_select]:border-[#9a7e71] [&_select]:bg-white [&_select]:px-3 [&_select]:py-2.5 [&_textarea]:w-full [&_textarea]:min-h-25 [&_textarea]:min-w-0 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#9a7e71] [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2.5 [&_input:hover]:border-[#d86432] [&_select:hover]:border-[#d86432] [&_textarea:hover]:border-[#d86432] [&_input:focus]:shadow-[0_0_0_3px_#ff5a1e14] [&_select:focus]:shadow-[0_0_0_3px_#ff5a1e14] [&_textarea:focus]:shadow-[0_0_0_3px_#ff5a1e14]",
  panel:
    "my-4 min-w-0 rounded-[15px] border border-[#f1ded5] bg-[#fff7f4] p-6 max-[700px]:p-[18px]",
  button:
    "my-2 inline-flex items-center justify-center rounded-[9px] bg-[#ff5a1e] px-[18px] py-[11px] text-center font-bold text-white hover:bg-[#c93b08]",
  textLink:
    "my-2 mr-3 inline-block underline underline-offset-3 hover:text-[#9e6014] hover:decoration-2",
  table:
    "w-full min-w-[640px] border-collapse text-left [&_th]:bg-[#fff7f4] [&_th]:px-4 [&_th]:py-3.5 [&_th]:text-[.79rem] [&_th]:tracking-[.04em] [&_th]:text-[#755849] [&_th]:uppercase [&_td]:border-t [&_td]:border-[#f0e2db] [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_tbody_tr:hover]:bg-[#fff9f6] [&_td:last-child]:text-right [&_th:last-child]:text-right",
};
