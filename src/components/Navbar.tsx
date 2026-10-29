import ProfileMenu from "./account/ProfileMenu";
import MobileMenu from "./MobileMenu";
import { UserRound } from "lucide-react";
import { NavLink } from "react-router";
import logo from "../assets/logo/donerhere_logo.png";
import CartDrawer from "./CartDrawer";
import { useSite } from "../store/site";
export default function Navbar() {
  const { user } = useSite();
  return (
    <header className="sticky top-0 z-50 bg-[#fff7f4] shadow-[0_1px_4px_#0001] [&>nav]:mx-auto [&>nav]:flex [&>nav]:min-h-[70px] [&>nav]:max-w-[1200px] [&>nav]:items-center [&>nav]:gap-6 [&>nav]:px-5 [&>nav]:py-3 max-[760px]:[&>nav]:min-h-[66px] max-[760px]:[&>nav]:gap-2.5 max-[760px]:[&>nav]:px-3.5 max-[760px]:[&>nav]:py-2.5">
      <nav aria-label="Main navigation">
        <NavLink
          to="/"
          className="shrink-0 [&_img]:w-[170px] [&_img]:max-w-full max-[760px]:[&_img]:w-[125px]"
        >
          <img src={logo} alt="DönerHere! home" />
        </NavLink>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-3 font-[650] [&_a]:rounded-[7px] [&_a:hover]:bg-[#ffeadf] [&_a:hover]:text-[#9e6014] [&_a.active]:bg-[#ffe9dc] [&_a.active]:text-[#a14615] [&_a:focus-visible]:bg-[#ffe4d1] [&_a:focus-visible]:underline [&_a:not(:has(svg))]:px-2.5 [&_a:not(:has(svg))]:py-[7px] [&_a:has(svg)]:p-1.5 max-[760px]:flex-nowrap max-[760px]:gap-2">
          <div className="flex items-center gap-3 max-[760px]:hidden">
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/locations">Locations</NavLink>
            {(user?.role === "employee" ||
              user?.role === "order_staff" ||
              user?.role === "admin") && (
              <NavLink to="/employee">Dashboard</NavLink>
            )}
          </div>
          <CartDrawer />
          {user ? (
            <ProfileMenu />
          ) : (
            <NavLink to="/account" aria-label="Sign in" title="Sign in">
              <UserRound size={24} aria-hidden="true" />
            </NavLink>
          )}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
