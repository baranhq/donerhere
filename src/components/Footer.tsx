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
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/">
            <img src={logo} alt="DönerHere! home" />
          </a>
          <div className="footer-contact">
            <p>Address, Country</p>
            <p>Phone number</p>
            <p>Email</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
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
      <div className="footer-bottom">
        <span className="footer-copyright">
          © 2026 <a href="https://github.com/baranhq/donerhere">DönerHere!</a> ·
          All rights reserved
        </span>
        <span
          className="footer-divider footer-section-divider"
          aria-hidden="true"
        >
          ·
        </span>
        <a href="/licenses">Licenses</a>
        <span className="footer-divider" aria-hidden="true">
          ·
        </span>
        <a href="https://baranhq.com/">Made by Baran</a>
      </div>
    </footer>
  );
}
