import logo from "../assets/logo/donerhere_logo.png";

const groups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    title: "Order",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "My account", href: "/account" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Licenses", href: "/licenses" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
export default function Footer() {
  return (
    <footer className="bg-[#fff7f4]">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 items-center gap-10 px-6 py-8 max-[700px]:grid-cols-1 max-[700px]:gap-[26px] max-[700px]:px-[22px] max-[700px]:py-7">
        <div className="[&_img]:h-auto [&_img]:w-[180px] max-[700px]:flex max-[700px]:items-center max-[700px]:justify-between max-[700px]:gap-5 max-[700px]:[&_img]:w-[150px]">
          <a href="/">
            <img src={logo} alt="DönerHere! home" />
          </a>
          <div className="mt-3 text-[.85rem] leading-[1.7] text-[#6e5b51] max-[700px]:m-0 max-[700px]:text-[.8rem]">
            <p>Address, Country</p>
            <p>Phone number</p>
            <p>Email</p>
          </div>
        </div>
        <nav
          className="grid grid-cols-4 gap-6 max-[480px]:grid-cols-2 [&_h2]:mb-2.5 [&_h2]:text-[.85rem] [&_h2]:text-[#8b7366] [&_a]:block [&_a]:w-fit [&_a]:py-1 [&_a]:text-[.9rem] [&_a:hover]:text-[#9e6014] max-[700px]:gap-5"
          aria-label="Footer navigation"
        >
          {groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </section>
          ))}
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-[#f5e9e5] px-5 py-3.5 text-center text-[.9rem] text-[#6c564b] [&_a:hover]:text-[#9e6014] max-[700px]:gap-x-2.5 max-[700px]:px-3 max-[700px]:text-[.8rem]">
        <span className="max-[600px]:basis-full">
          © 2026 <a href="https://github.com/baranhq/donerhere">DönerHere!</a> ·
          All rights reserved
        </span>
        <span className="text-[#ae9587] max-[600px]:hidden" aria-hidden="true">
          ·
        </span>
        <a href="https://baranhq.com/">Made by Baran</a>
      </div>
    </footer>
  );
}
