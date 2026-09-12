import { NavLink } from "react-router";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetTrigger } from "../../@/components/ui/sheet";

function Navbar() {
  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="flex h-[70px] bg-[#fff7f4]">
          <div className=" flex flex-1 justify-center items-center w-auto">
            <a href="/">
              <img
                className="max-h-[45px] ml-[15px] mr-[15px]"
                src="/src/assets/logo/donerhere_logo.png"
                alt=""
              />
            </a>
          </div>
          <div className="md:flex flex-1 justify-center w-full font-bold hidden">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-[20px] bg-transparent">
                <NavigationMenuItem>
                  <NavLink
                    to="/menu"
                    end={false}
                    className={({ isActive }) =>
                      `text-[16px] p-[5px] pl-[10px] pr-[10px] ${
                        isActive ? "text-black bg-orange-200 rounded-[5px]" : ""
                      } hover:text-[#9e6014]`
                    }
                  >
                    Menu
                  </NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink
                    to="/locations"
                    className={({ isActive }) =>
                      `text-[16px] p-[5px] pl-[10px] pr-[10px] ${
                        isActive ? "text-black bg-orange-200 rounded-[5px]" : ""
                      } hover:text-[#9e6014]`
                    }
                  >
                    Locations
                  </NavLink>
                </NavigationMenuItem>

                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-[16px] font-bold hover:text-[#9e6014] bg-transparent hover:bg-transparent p-[5px] pl-[10px] pr-[10px]">
                      About us
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink
                        href="/contact-us"
                        className="text-[16px] hover:text-[#9e6014] hover:bg-transparent"
                      >
                        Contact us
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="/feedback"
                        className="text-[16px] hover:text-[#9e6014] hover:bg-transparent"
                      >
                        Feedback
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className=" flex flex-1 md:justify-center items-center w-full h-full justify-end ml-[15px] mr-[15px]">
            <Sheet>
              <SheetTrigger className="hover:text-[#9e6014]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-shopping-cart"
                >
                  <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
                  <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
                  <circle cx="18" cy="20" r="2" />
                  <circle cx="8" cy="20" r="2" />
                </svg>
              </SheetTrigger>
              <SheetContent>
                <div className="flex w-full h-[15px]"></div>
                <div className="flex w-full h-full justify-center items-center">
                  <div className="text-[24px] font-semibold  p-[20px] text-center">
                    <p>Your cart is empty</p>
                    <p className="text-[12px] text-gray-400">
                      Add something delicious!
                    </p>
                  </div>
                </div>
                <div>
                  <a
                    href="/checkout"
                    className="flex justify-center items-center gap-[5px] text-[24px] font-semibold p-[5px] m-[15px]
                  bg-[#ff5a1e] text-white
                   bg-gray-300 cursor-not-allowed"
                  >
                    Checkout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-arrow-right"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="md:hidden flex justify-center items-center ml-[15px] mr-[15px]">
            <Sheet>
              <SheetTrigger className="hover:text-[#9e6014]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-menu"
                >
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              </SheetTrigger>
              <SheetContent>
                <div className="flex w-full h-[15px]"></div>
                <div className="text-[24px] font-semibold p-[20px]">
                  <nav className="flex flex-col">
                    <NavLink
                      to="/menu"
                      end={false}
                      className={({ isActive }) =>
                        `${isActive ? "text-orange-500 " : ""} hover:text-[#9e6014]`
                      }
                    >
                      Menu
                    </NavLink>
                    <NavLink
                      to="/Locations"
                      className={({ isActive }) =>
                        `${isActive ? "text-orange-500 " : ""} hover:text-[#9e6014]`
                      }
                    >
                      Locations
                    </NavLink>
                    <NavLink
                      to="/contact-us"
                      className={({ isActive }) =>
                        `${isActive ? "text-orange-500 " : ""} hover:text-[#9e6014]`
                      }
                    >
                      Contact us
                    </NavLink>
                    <NavLink
                      to="/feedback"
                      className={({ isActive }) =>
                        `${isActive ? "text-orange-500 " : ""} hover:text-[#9e6014]`
                      }
                    >
                      Feedback
                    </NavLink>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
