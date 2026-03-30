import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  UserCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../hooks/useQueries";
import { useAllProducts, useReviews } from "../hooks/useQueries";

function SellerProductCard({
  product,
  onBuyNow,
}: { product: Product; onBuyNow: () => void }) {
  const { data: reviews = [] } = useReviews(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;
  const price = Number(product.price) / 100;

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border bg-white hover:shadow-sm transition-shadow">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/80x80/EEF5FB/1E73E8?text=N/A";
          }}
        />
        {product.isSold && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
              SOLD
            </Badge>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground line-clamp-1 mb-0.5">
          {product.title}
        </h4>
        <div className="flex items-center gap-0.5 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${
                s <= Math.round(avgRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          {reviews.length > 0 && (
            <span className="text-xs text-muted-foreground ml-1">
              {avgRating.toFixed(1)} ({reviews.length})
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-foreground mb-2">
          ${price.toFixed(2)}
        </p>
        <Button
          size="sm"
          onClick={onBuyNow}
          disabled={product.isSold}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs h-7 px-3"
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}

interface SellerProfilePanelProps {
  sellerPrincipal: Principal | null;
  open: boolean;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  sellerStats?: { avg: number; count: number; isVerified: boolean };
}

export default function SellerProfilePanel({
  sellerPrincipal,
  open,
  onClose,
  onBuyNow,
  sellerStats,
}: SellerProfilePanelProps) {
  const { data: allProducts = [] } = useAllProducts();

  const sellerProducts = sellerPrincipal
    ? allProducts.filter(
        (p) => p.seller.toString() === sellerPrincipal.toString(),
      )
    : [];

  const activeListings = sellerProducts.filter((p) => !p.isSold);
  const soldListings = sellerProducts.filter((p) => p.isSold);
  const sellerIdShort = `${sellerPrincipal?.toString().slice(0, 12)}…`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        data-ocid="seller_profile.dialog"
      >
        {/* Seller header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <UserCircle2 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogHeader>
              <DialogTitle className="text-left text-base font-semibold">
                Seller Profile
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {sellerIdShort}
            </p>
            {sellerStats?.isVerified && (
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium text-blue-500">
                  Verified Seller
                </span>
              </div>
            )}
            {sellerStats && sellerStats.count > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-foreground">
                  {sellerStats.avg.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({sellerStats.count} reviews)
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {sellerProducts.length}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">listings</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
          <div className="py-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {activeListings.length}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {soldListings.length}
            </p>
            <p className="text-xs text-muted-foreground">Sold</p>
          </div>
        </div>

        {/* Listings */}
        <ScrollArea className="max-h-96" data-ocid="seller_profile.listings">
          {sellerProducts.length === 0 ? (
            <div
              className="py-12 text-center"
              data-ocid="seller_profile.empty_state"
            >
              <div className="text-3xl mb-2">🏪</div>
              <p className="text-sm font-medium text-foreground">
                No listings yet
              </p>
            </div>
          ) : (
            <motion.div
              className="p-3 flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {sellerProducts.map((product, i) => (
                <motion.div
                  key={product.id.toString()}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  data-ocid={`seller_profile.item.${i + 1}`}
                >
                  <SellerProductCard
                    product={product}
                    onBuyNow={() => {
                      onBuyNow(product);
                      onClose();
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
