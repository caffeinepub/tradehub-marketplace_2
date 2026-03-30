import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Tag, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onShopNow: () => void;
  onSellClick: () => void;
}

export default function Hero({ onShopNow, onSellClick }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-secondary/60 via-background to-background border-b border-border overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-secondary blur-3xl" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              10,000+ items listed this week
            </div>
            <h1 className="text-5xl lg:text-[3.5rem] font-bold text-foreground leading-tight mb-5">
              Buy &amp; Sell
              <br />
              <span className="text-primary">Anything,</span> Anywhere
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg mb-10 max-w-md leading-relaxed">
              TradeHub connects buyers and sellers in a fast, safe, and easy
              marketplace. Find great deals or list your items in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onShopNow}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-3 h-auto text-base font-semibold shadow-card-hover"
                data-ocid="hero.primary_button"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onSellClick}
                className="rounded-full px-10 py-3 h-auto text-base border-2 border-primary text-primary hover:bg-secondary font-semibold"
                data-ocid="hero.secondary_button"
              >
                <Tag className="w-5 h-5 mr-2" />
                Start Selling
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary tracking-tight">
                  250K+
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Active Listings
                </div>
              </motion.div>
              <div className="w-px h-14 bg-border" />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary tracking-tight">
                  98%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Happy Buyers
                </div>
              </motion.div>
              <div className="w-px h-14 bg-border" />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="text-4xl font-bold text-primary tracking-tight">
                  4.9
                </div>
                <div className="flex flex-col">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg Rating
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-secondary aspect-[4/3] shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                alt="People shopping online"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl pointer-events-none" />
            </div>

            {/* Just sold badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 border border-border"
            >
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Just sold</div>
                <div className="text-sm font-semibold text-foreground">
                  iPhone 15 Pro Max
                </div>
              </div>
            </motion.div>

            {/* Floating trust badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 }}
              className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-2xl shadow-card px-3 py-2 flex items-center gap-2"
            >
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span className="text-xs font-bold">Trusted Marketplace</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
