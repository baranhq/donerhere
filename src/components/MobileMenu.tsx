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
        className="hidden max-[760px]:inline-flex max-[760px]:h-10 max-[760px]:w-9 max-[760px]:items-center max-[760px]:justify-center max-[760px]:rounded-md hover:bg-[#ffeadf] hover:text-[#9e6014]"
        aria-label="Open navigation menu"
      >
        <Menu size={24} aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="bg-[#fffaf6] [&_nav]:flex [&_nav]:flex-col [&_nav]:gap-2 [&_nav]:p-4 [&_nav_a]:rounded-lg [&_nav_a]:px-4 [&_nav_a]:py-3.5 [&_nav_a]:text-[1.2rem] [&_nav_a]:font-[650] [&_nav_a:hover]:bg-[#ffe8d9] [&_nav_a:hover]:text-[#9e6014] [&_nav_a.active]:bg-[#ffe8d9] [&_nav_a.active]:text-[#9e6014]">
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
          {(user?.role === "employee" ||
            user?.role === "order_staff" ||
            user?.role === "admin") && (
            <NavLink to="/employee" onClick={() => setOpen(false)}>
              Employee dashboard
            </NavLink>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
