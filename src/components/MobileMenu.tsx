import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../@/components/ui/sheet";
import { useSite } from "../store/site";
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useSite();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="mobile-menu-trigger"
        aria-label="Open navigation menu"
      >
        <Menu size={24} aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="mobile-menu">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">DönerHere!</SheetTitle>
          <SheetDescription>
            Explore the menu and find your nearest store.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile navigation">
          <NavLink to="/menu" onClick={() => setOpen(false)}>
            Menu
          </NavLink>
          <NavLink to="/locations" onClick={() => setOpen(false)}>
            Locations
          </NavLink>
          <NavLink to="/account" onClick={() => setOpen(false)}>
            {user ? "My account" : "Sign in"}
          </NavLink>
          {user?.role === "employee" && (
            <NavLink to="/employee" onClick={() => setOpen(false)}>
              Employee dashboard
            </NavLink>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
