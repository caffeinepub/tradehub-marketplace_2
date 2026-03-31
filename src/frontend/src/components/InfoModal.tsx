import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoModalProps {
  type: string | null;
  onClose: () => void;
}

const CONTENT: Record<string, { title: string; body: React.ReactNode }> = {
  about: {
    title: "About TradeHub",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base font-semibold text-foreground">
          Built for real people. Driven by trust.
        </p>
        <p>
          TradeHub was founded in 2022 by a small team of engineers and
          designers frustrated by cluttered, scammy marketplaces. We set out to
          build a cleaner, safer, faster place to buy and sell anything—from
          vintage sneakers to luxury cars.
        </p>
        <p>
          Today, TradeHub connects hundreds of thousands of buyers and sellers
          across the globe. Our platform is built on the Internet Computer,
          ensuring transparent, censorship-resistant transactions with no hidden
          fees and no middlemen.
        </p>
        <h3 className="font-semibold text-foreground mt-4">How it works</h3>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>Sign in securely with Internet Identity—no password needed.</li>
          <li>List your item in under 2 minutes with photos and a price.</li>
          <li>Buyers browse, chat, and purchase directly from sellers.</li>
          <li>Sellers receive payment and ship the item. Done.</li>
        </ol>
        <h3 className="font-semibold text-foreground mt-4">Our mission</h3>
        <p>
          To create the world's most trusted peer-to-peer marketplace—where
          every transaction is fair, every seller is accountable, and every
          buyer feels confident.
        </p>
      </div>
    ),
  },
  careers: {
    title: "Careers at TradeHub",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base font-semibold text-foreground">
          Help us build the future of commerce.
        </p>
        <p>
          We're a small, fast-moving team that ships quickly and cares deeply
          about quality. If you want your work to matter from day one, you'll
          fit right in.
        </p>
        <h3 className="font-semibold text-foreground mt-4">Open Roles</h3>
        <div className="space-y-3">
          {[
            {
              role: "Senior Full-Stack Engineer",
              team: "Platform",
              type: "Remote",
            },
            { role: "Product Designer", team: "Growth", type: "Remote" },
            {
              role: "Trust & Safety Analyst",
              team: "Operations",
              type: "Hybrid",
            },
            { role: "iOS / Android Engineer", team: "Mobile", type: "Remote" },
          ].map((job) => (
            <div
              key={job.role}
              className="border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{job.role}</p>
                <p className="text-xs text-muted-foreground">
                  {job.team} · {job.type}
                </p>
              </div>
              <Button size="sm" variant="outline">
                Apply
              </Button>
            </div>
          ))}
        </div>
        <h3 className="font-semibold text-foreground mt-4">Benefits</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Competitive salary + equity</li>
          <li>Fully remote-friendly</li>
          <li>Unlimited PTO</li>
          <li>$2,000/year learning budget</li>
          <li>Top-tier health, dental & vision</li>
        </ul>
      </div>
    ),
  },
  press: {
    title: "Press & Media",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          TradeHub has been featured in leading technology and business
          publications worldwide. For press inquiries, contact{" "}
          <span className="text-primary font-medium">press@tradehub.io</span>.
        </p>
        <h3 className="font-semibold text-foreground mt-4">Recent Coverage</h3>
        <div className="space-y-3">
          {[
            {
              outlet: "TechCrunch",
              headline:
                "TradeHub raises $12M to decentralize peer-to-peer commerce",
              date: "Feb 2026",
            },
            {
              outlet: "Forbes",
              headline: "The 10 hottest Web3 marketplaces to watch in 2026",
              date: "Jan 2026",
            },
            {
              outlet: "The Verge",
              headline:
                "Can blockchain fix online marketplaces? TradeHub thinks so",
              date: "Dec 2025",
            },
            {
              outlet: "Wired",
              headline: "TradeHub hits 250K listings in its first year",
              date: "Nov 2025",
            },
          ].map((item) => (
            <div
              key={item.headline}
              className="border border-border rounded-lg p-3"
            >
              <p className="text-xs font-bold text-primary mb-0.5">
                {item.outlet}
              </p>
              <p className="font-medium text-foreground text-sm">
                {item.headline}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.date}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-secondary/40 rounded-lg">
          <p className="font-medium text-foreground text-sm">Media Kit</p>
          <p className="text-xs text-muted-foreground mt-1">
            Download our logo, brand guidelines, and product screenshots.
          </p>
          <Button size="sm" variant="outline" className="mt-2">
            Download Media Kit
          </Button>
        </div>
      </div>
    ),
  },
  blog: {
    title: "TradeHub Blog",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>Tips, guides, and marketplace news from the TradeHub team.</p>
        <div className="space-y-4">
          {[
            {
              title: "10 Tips for Selling Electronics Fast",
              date: "Mar 25, 2026",
              summary:
                "Learn how top sellers price, photograph, and describe their tech listings to move inventory in under 48 hours.",
            },
            {
              title: "How to Get the Best Deal on Used Cars",
              date: "Mar 18, 2026",
              summary:
                "A step-by-step guide to researching, negotiating, and safely purchasing a used vehicle from a private seller.",
            },
            {
              title: "Fashion Resale: What's Hot This Season",
              date: "Mar 10, 2026",
              summary:
                "From vintage denim to limited-edition sneakers—here are the fashion categories driving the most sales on TradeHub right now.",
            },
            {
              title: "Seller Verification: Why It Matters",
              date: "Mar 2, 2026",
              summary:
                "We explain how TradeHub's verified seller badge works and why buyers should look for it before making a purchase.",
            },
          ].map((post) => (
            <div
              key={post.title}
              className="border-b border-border pb-4 last:border-0"
            >
              <p className="font-medium text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                {post.date}
              </p>
              <p className="text-sm">{post.summary}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base font-semibold text-foreground">
          We'd love to hear from you.
        </p>
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-4">
            <p className="font-semibold text-foreground text-sm">
              📧 Email Support
            </p>
            <p className="text-primary font-medium mt-1">support@tradehub.io</p>
            <p className="text-xs mt-1">
              Typical response time: within 24 hours on business days
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="font-semibold text-foreground text-sm">
              💬 Live Chat
            </p>
            <p className="mt-1">
              Use the chat bubble in the bottom-right corner for instant help.
              Available Mon–Fri, 9am–6pm EST.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="font-semibold text-foreground text-sm">
              🐛 Report a Bug
            </p>
            <p className="mt-1">
              Found an issue? Email{" "}
              <span className="text-primary">bugs@tradehub.io</span> with a
              description and screenshot.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="font-semibold text-foreground text-sm">🏢 Office</p>
            <p className="mt-1">
              TradeHub Inc. · 340 Pine Street, Suite 800 · San Francisco, CA
              94104
            </p>
          </div>
        </div>
      </div>
    ),
  },
  safety: {
    title: "Safety Tips",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base font-semibold text-foreground">
          Stay safe every time you buy or sell.
        </p>
        <div className="space-y-3">
          {[
            {
              icon: "🔍",
              tip: "Research before you buy",
              desc: "Check the seller's rating, reviews, and verified badge. Look at listing photos carefully and ask questions if anything seems off.",
            },
            {
              icon: "💬",
              tip: "Keep all communication on TradeHub",
              desc: "Never move conversations to WhatsApp, email, or SMS. Scammers use off-platform messaging to avoid detection.",
            },
            {
              icon: "🚫",
              tip: "Never pay outside the platform",
              desc: "Avoid wire transfers, gift cards, or cryptocurrency payments to unknown parties. Use only TradeHub's secure checkout.",
            },
            {
              icon: "📸",
              tip: "Inspect before you buy locally",
              desc: "For in-person meetups, bring a friend. Meet in a well-lit public place and inspect the item thoroughly before handing over payment.",
            },
            {
              icon: "🔒",
              tip: "Protect your account",
              desc: "Use Internet Identity for passwordless, phishing-resistant login. Never share your credentials with anyone.",
            },
            {
              icon: "⚠️",
              tip: "Report suspicious activity",
              desc: "If a deal seems too good to be true, it probably is. Report suspicious listings or users immediately using the flag button.",
            },
          ].map(({ icon, tip, desc }) => (
            <div
              key={tip}
              className="flex gap-3 items-start border border-border rounded-lg p-3"
            >
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="font-medium text-foreground">{tip}</p>
                <p className="text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p className="text-xs">Last updated: March 31, 2026</p>
        <p>
          TradeHub Inc. (“TradeHub”, “we”, “us”) is committed to protecting your
          privacy. This policy explains how we collect, use, and share
          information about you when you use our services.
        </p>
        <h3 className="font-semibold text-foreground">
          1. Information We Collect
        </h3>
        <p>
          We collect information you provide directly (listings, messages,
          reviews), information generated automatically (usage data, IP
          addresses), and your Internet Identity principal (a pseudonymous
          identifier—no email or name required).
        </p>
        <h3 className="font-semibold text-foreground">
          2. How We Use Your Information
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and improve TradeHub services</li>
          <li>To facilitate transactions between buyers and sellers</li>
          <li>To detect and prevent fraud and abuse</li>
          <li>To communicate product updates and support responses</li>
        </ul>
        <h3 className="font-semibold text-foreground">3. Data Sharing</h3>
        <p>
          We do not sell your personal data. We may share information with
          service providers who assist in operating our platform, or as required
          by law. Listing information (title, photos, price) is public by
          design.
        </p>
        <h3 className="font-semibold text-foreground">4. Data Retention</h3>
        <p>
          We retain your data for as long as your account is active or as needed
          to provide services. You may request deletion by contacting
          support@tradehub.io.
        </p>
        <h3 className="font-semibold text-foreground">5. Security</h3>
        <p>
          TradeHub is built on the Internet Computer, which uses cryptographic
          authentication. We apply industry-standard security measures to
          protect all stored data.
        </p>
        <h3 className="font-semibold text-foreground">6. Contact</h3>
        <p>
          Questions about this policy? Email us at{" "}
          <span className="text-primary">privacy@tradehub.io</span>.
        </p>
      </div>
    ),
  },
};

export default function InfoModal({ type, onClose }: InfoModalProps) {
  const content = type ? CONTENT[type] : null;

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full" data-ocid="info.modal">
        <DialogHeader>
          <DialogTitle>{content?.title ?? ""}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-2">{content?.body}</ScrollArea>
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="info.close_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
