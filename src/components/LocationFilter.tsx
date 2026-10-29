import { Check } from "lucide-react";
import { filterOption } from "./filters/styles";
type Props = { name: string; isActive: boolean; onClick: () => void };
export default function LocationFilter({ name, isActive, onClick }: Props) {
  return (
    <button
      className={filterOption(isActive)}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <span className="flex-1">{name}</span>
      {isActive && <Check size={15} aria-hidden="true" />}
    </button>
  );
}
