import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Tag } from "lucide-react";
import { motion } from "motion/react";

const TOP_SELLERS = [
  { name: "Alice M.", amount: "$12,450", badge: "🏆", initials: "AM" },
  { name: "Bob T.", amount: "$9,800", badge: "🥈", initials: "BT" },
  { name: "Carol S.", amount: "$7,200", badge: "🥉", initials: "CS" },
  { name: "David K.", amount: "$5,650", badge: "⭐", initials: "DK" },
  { name: "Eve R.", amount: "$4,320", badge: "⭐", initials: "ER" },
];

const BLOG_POSTS = [
  {
    title: "10 Tips for Selling Electronics Fast",
    date: "Mar 25, 2026",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
  },
  {
    title: "How to Get the Best Deal on Used Cars",
    date: "Mar 18, 2026",
    img: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=200",
  },
  {
    title: "Fashion Resale: What's Hot This Season",
    date: "Mar 10, 2026",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
];

interface BottomContentProps {
  onSellClick: () => void;
}

export default function BottomContent({ onSellClick }: BottomContentProps) {
  return (
    <section className="py-10 grid lg:grid-cols-3 gap-6">
      {/* Start Selling Promo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary rounded-2xl p-6 flex flex-col justify-between min-h-[220px]"
      >
        <div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-primary-foreground mb-2">
            Start Selling Today
          </h3>
          <p className="text-primary-foreground/80 text-sm">
            List your items in under 2 minutes and reach thousands of buyers.
          </p>
        </div>
        <Button
          onClick={onSellClick}
          className="mt-4 bg-white text-primary hover:bg-white/90 rounded-full font-semibold w-fit"
          data-ocid="promo.primary_button"
        >
          Create Listing
        </Button>
      </motion.div>

      {/* Top Sellers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">
          🏆 Top Sellers This Week
        </h3>
        <div className="space-y-3">
          {TOP_SELLERS.map((seller, i) => (
            <div
              key={seller.name}
              className="flex items-center gap-3"
              data-ocid={`sellers.item.${i + 1}`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                  {seller.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {seller.name}
                </div>
              </div>
              <div className="text-sm font-bold text-primary">
                {seller.amount}
              </div>
              <span className="text-base">{seller.badge}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Blog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-border p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">📝 TradeHub Blog</h3>
        <div className="space-y-3">
          {BLOG_POSTS.map((post, i) => (
            <div
              key={post.title}
              className="flex gap-3 items-start"
              data-ocid={`blog.item.${i + 1}`}
            >
              <img
                src={post.img}
                alt={post.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/48x48";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {post.date}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
