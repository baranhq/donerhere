function Footer() {
  return (
    <div>
      <div className="bg-[#fff7f4] w-full md:h-[200px] h-auto flex md:pl-[200px] md:pr-[200px]">
        <div className="hidden md:flex flex-1 w-full h-full items-center justify-center flex-col mr-[150px]">
          <div>
            <img
              className="max-w-[200px]"
              src="src/assets/logo/donerhere_logo.png"
              alt=""
            />
            <div className="flex flex-col">
              <a>Address, Country</a>
              <a className="hover:text-[#9e6014]" href="tel:">
                Phone number
              </a>
              <a className="hover:text-[#9e6014]" href="mailto:">
                Email
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-1 w-full h-full  justify-center items-center flex-col">
          <div className="flex flex-row md:gap-[40px] gap-[50px] justify-center">
            <div>
              <p className="opacity-50">Explore</p>
              <div className="flex flex-col">
                <a href="/" className="hover:text-[#9e6014]">
                  Home
                </a>
                <a href="/menu" className="hover:text-[#9e6014]">
                  Menu
                </a>
                <a href="/locations" className="hover:text-[#9e6014]">
                  Locations
                </a>
                <a href="/our-story" className="hover:text-[#9e6014]">
                  Our Story
                </a>
              </div>
            </div>
            <div>
              <p className="opacity-50">Order</p>
              <div className="flex flex-col">
                <a href="/menu" className="hover:text-[#9e6014]">
                  Menu
                </a>
              </div>
            </div>
            <div>
              <p className="opacity-50">Help</p>
              <div className="flex flex-col">
                <a href="/contact-us" className="hover:text-[#9e6014]">
                  Contact Us
                </a>
                <a href="/feedback" className="hover:text-[#9e6014]">
                  Feedback
                </a>
              </div>
            </div>
          </div>
          <div className="md:hidden flex flex-col mt-[20px] text-center">
            <div className="flex flex-col">
              <a>Address, Country</a>
              <a className="hover:text-[#9e6014]" href="tel:">
                Phone number
              </a>
              <a className="hover:text-[#9e6014]" href="mailto:">
                Email
              </a>
              <div className="flex justify-center">
                <img
                  className="w-[80%]"
                  src="src/assets/logo/donerhere_logo.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center bg-[#f5e9e5] flex-col">
        <div>
          <a> © 2026 </a>
          <a
            href="https://github.com/barannnnnnnnn/donerhere"
            className="hover:text-[#9e6014]"
          >
            DönerHere!
          </a>
          <a> · All rights reserved</a>
        </div>
        <a
          href="https://github.com/barannnnnnnnn"
          className="hover:text-[#9e6014]"
        >
          Website made by Baran
        </a>
      </div>
    </div>
  );
}

export default Footer;
