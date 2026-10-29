import { NavLink, useLocation } from "react-router";
import { filterOption } from "./filters/styles";
type Props = { name: string; slug: string; image: string };
export default function MenuCategory({ name, slug, image }: Props) {
  const active = useLocation().pathname === `/menu/${slug}`;
  return (
    <>
      <NavLink
        to={`/menu/${slug}`}
        className={`${filterOption(active)} shrink-0 max-lg:w-auto`}
      >
        <img
          className="size-11 shrink-0 object-contain"
          src={image}
          alt=""
          width={44}
          height={44}
        />
        <span className="flex-1 whitespace-nowrap">{name}</span>
      </NavLink>
      <span
        aria-hidden="true"
        className="mx-3 block h-px bg-stone-300/70 max-lg:hidden"
      />
    </>
  );
}
