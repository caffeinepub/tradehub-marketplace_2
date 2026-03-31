import { SiFacebook, SiGithub, SiInstagram, SiX } from "react-icons/si";

const SOCIAL_LINKS = [
  { Icon: SiGithub, label: "GitHub", url: "https://github.com" },
  { Icon: SiX, label: "X", url: "https://x.com" },
  { Icon: SiInstagram, label: "Instagram", url: "https://instagram.com" },
  { Icon: SiFacebook, label: "Facebook", url: "https://facebook.com" },
];

const FOOTER_LINKS: Record<string, string[]> = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Categories: ["Electronics", "Fashion", "Home & Garden", "Autos"],
  Support: ["Help Center", "Contact Us", "Safety Tips", "Privacy Policy"],
};

interface FooterProps {
  onLinkClick?: (type: string) => void;
  onCategorySelect?: (cat: string) => void;
  onHelpClick?: () => void;
}

export default function Footer({
  onLinkClick,
  onCategorySelect,
  onHelpClick,
}: FooterProps) {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  const handleLink = (section: string, link: string) => {
    const key = link.toLowerCase();
    if (section === "Company") {
      const typeMap: Record<string, string> = {
        "about us": "about",
        careers: "careers",
        press: "press",
        blog: "blog",
      };
      onLinkClick?.(typeMap[key] ?? key);
    } else if (section === "Support") {
      if (key === "help center") {
        onHelpClick?.();
      } else {
        const typeMap: Record<string, string> = {
          "contact us": "contact",
          "safety tips": "safety",
          "privacy policy": "privacy",
        };
        onLinkClick?.(typeMap[key] ?? key);
      }
    } else if (section === "Categories") {
      const catMap: Record<string, string> = {
        electronics: "electronics",
        fashion: "fashion",
        "home & garden": "home",
        autos: "autos",
      };
      onCategorySelect?.(catMap[key] ?? key);
    }
  };

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
                    <button
                      type="button"
                      onClick={() => handleLink(section, link)}
                      className="hover:text-primary transition-colors cursor-pointer text-left"
                      data-ocid="footer.link"
                    >
                      {link}
                    </button>
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
            {SOCIAL_LINKS.map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-150"
                data-ocid="footer.link"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
