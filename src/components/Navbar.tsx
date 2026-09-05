import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../@/components/ui/navigation-menu";

function Navbar() {
  return (
    <>
      <nav className="flex h-[70px] bg-[#fff7f4]">
        <div className=" flex flex-1 justify-center items-center w-full h-full">
          <a href="/">
            <img
              className="h-[45px]"
              src="/src/assets/logo/donerhere_logo.png"
              alt=""
            />
          </a>
        </div>
        <div className="flex flex-1 justify-center w-full font-bold">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-[15px]">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/menu"
                  className="text-[16px] hover:text-[#9e6014] hover:bg-transparent"
                >
                  Menu
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/restaurant"
                  className="text-[16px] hover:text-[#9e6014] hover:bg-transparent"
                >
                  Restaurant
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[16px] font-bold hover:text-[#9e6014] bg-transparent hover:bg-transparent ">
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
                    <NavigationMenuLink
                      href="/our-story"
                      className="text-[16px] hover:text-[#9e6014] hover:bg-transparent"
                    >
                      Our story
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className=" flex flex-1 justify-center items-center w-full h-full ">
          <a href="/cart" className="hover:text-[#9e6014]">
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
          </a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
