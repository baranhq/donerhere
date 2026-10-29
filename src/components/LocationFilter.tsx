import { Check } from "lucide-react";
type Props = { name: string; isActive: boolean; onClick: () => void };
export default function LocationFilter({ name, isActive, onClick }: Props) {
  return (
    <button
      className={`location-filter ${isActive ? "selected" : ""}`}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <span>{name}</span>
      {isActive && <Check size={17} aria-hidden="true" />}
    </button>
  );
}
