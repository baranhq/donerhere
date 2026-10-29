import { Check } from "lucide-react";
type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  centered?: boolean;
};
export default function SuccessHeader({
  title,
  description,
  eyebrow,
  centered = false,
}: Props) {
  return (
    <header
      role="status"
      className={`mb-8 flex gap-4 rounded-xl border border-green-200 bg-green-50 px-6 py-7 ${centered ? "flex-col items-center text-center" : "items-start max-sm:flex-col"}`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
        <Check size={28} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <div>
        {eyebrow && (
          <p className="mt-0! text-sm font-semibold text-green-800">
            {eyebrow}
          </p>
        )}
        <h1 className="mb-2! text-[clamp(1.6rem,3vw,2.2rem)]!">{title}</h1>
        <p className="mb-0! text-stone-700">{description}</p>
      </div>
    </header>
  );
}
