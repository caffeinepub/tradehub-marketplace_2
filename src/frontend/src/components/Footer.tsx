import { SiFacebook, SiGithub, SiInstagram, SiX } from "react-icons/si";

const FOOTER_LINKS = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Categories: ["Electronics", "Fashion", "Home & Garden", "Autos"],
  Support: ["Help Center", "Contact Us", "Safety Tips", "Privacy Policy"],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-secondary/30 border-t border-border mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <img
                src="/assets/generated/tradehub-logo-transparent.dim_200x200.png"
                alt="TradeHub logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg text-foreground">
                TradeHub
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The modern marketplace for buying and selling everything.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-foreground text-sm mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link}>
                    <span
                      className="hover:text-primary transition-colors cursor-pointer"
                      data-ocid="footer.link"
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-2">
            {[
              { Icon: SiGithub, label: "GitHub" },
              { Icon: SiX, label: "X" },
              { Icon: SiInstagram, label: "Instagram" },
              { Icon: SiFacebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-150 cursor-pointer"
                data-ocid="footer.link"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
