import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Tag, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onShopNow: () => void;
  onSellClick: () => void;
}

export default function Hero({ onShopNow, onSellClick }: HeroProps) {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <TrendingUp className="w-3.5 h-3.5" />
              10,000+ items listed this week
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Buy & Sell
              <br />
              <span className="text-primary">Anything,</span> Anywhere
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-md">
              TradeHub connects buyers and sellers in a fast, safe, and easy
              marketplace. Find great deals or list your items in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onShopNow}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 font-semibold"
                data-ocid="hero.primary_button"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                onClick={onSellClick}
                className="rounded-full px-7 border-primary text-primary hover:bg-secondary font-semibold"
                data-ocid="hero.secondary_button"
              >
                <Tag className="w-4 h-4 mr-2" />
                Start Selling
              </Button>
            </div>
            <div className="flex items-center gap-5 mt-8">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">250K+</div>
                <div className="text-xs text-muted-foreground">
                  Active Listings
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">98%</div>
                <div className="text-xs text-muted-foreground">
                  Happy Buyers
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex items-center gap-1">
                <div className="text-xl font-bold text-foreground">4.9</div>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="text-xs text-muted-foreground ml-1">
                  Avg Rating
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden bg-secondary aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                alt="People shopping online"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Just sold</div>
                <div className="text-sm font-semibold text-foreground">
                  iPhone 15 Pro Max
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
