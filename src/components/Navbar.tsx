import MobileMenu from "./MobileMenu";
import { UserRound } from "lucide-react";
import { NavLink } from "react-router";
import logo from "../assets/logo/donerhere_logo.png";
import CartDrawer from "./CartDrawer";
import { useSite } from "../store/site";
export default function Navbar() {
  const { user } = useSite();
  return (
    <header className="site-header">
      <nav aria-label="Main navigation">
        <NavLink to="/" className="brand">
          <img src={logo} alt="DönerHere! home" />
        </NavLink>
        <div className="nav-links">
          <div className="desktop-nav">
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/locations">Locations</NavLink>
            {(user?.role === "employee" || user?.role === "admin") && (
              <NavLink to="/employee">Dashboard</NavLink>
            )}
          </div>
          <NavLink
            to="/account"
            aria-label={user ? "My account" : "Sign in"}
            title={user ? "My account" : "Sign in"}
          >
            <UserRound size={24} aria-hidden="true" />
          </NavLink>
          <CartDrawer />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
