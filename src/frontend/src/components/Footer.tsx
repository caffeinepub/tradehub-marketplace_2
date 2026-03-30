import { Store } from "lucide-react";
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
    <footer className="bg-white border-t border-border mt-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">TradeHub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The modern marketplace for buying and selling everything.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-foreground text-sm mb-3">
                {section}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
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

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
          <div className="flex items-center gap-4">
            <span
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              data-ocid="footer.link"
            >
              <SiGithub className="w-4 h-4" />
            </span>
            <span
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              data-ocid="footer.link"
            >
              <SiX className="w-4 h-4" />
            </span>
            <span
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              data-ocid="footer.link"
            >
              <SiInstagram className="w-4 h-4" />
            </span>
            <span
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              data-ocid="footer.link"
            >
              <SiFacebook className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
