import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../hooks/useQueries";
import { ProductCategory, useReviews } from "../hooks/useQueries";

const STARS = [1, 2, 3, 4, 5];

const CATEGORY_LABELS: Record<string, string> = {
  [ProductCategory.electronics as unknown as string]: "Electronics",
  [ProductCategory.fashion as unknown as string]: "Fashion",
  [ProductCategory.home as unknown as string]: "Home",
  [ProductCategory.sports as unknown as string]: "Sports",
  [ProductCategory.hobbies as unknown as string]: "Hobbies",
  [ProductCategory.autos as unknown as string]: "Autos",
};

const CATEGORY_COLORS: Record<string, string> = {
  [ProductCategory.electronics as unknown as string]: "bg-blue-600",
  [ProductCategory.fashion as unknown as string]: "bg-pink-600",
  [ProductCategory.home as unknown as string]: "bg-orange-500",
  [ProductCategory.sports as unknown as string]: "bg-green-600",
  [ProductCategory.hobbies as unknown as string]: "bg-purple-600",
  [ProductCategory.autos as unknown as string]: "bg-red-600",
};

interface ProductCardProps {
  product: Product;
  index: number;
  onBuyNow: () => void;
  onViewReviews: () => void;
  onViewSeller: () => void;
  isVerifiedSeller: boolean;
  onProductClick: () => void;
}

export default function ProductCard({
  product,
  index,
  onBuyNow,
  onViewReviews,
  onViewSeller,
  isVerifiedSeller,
  onProductClick,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { data: reviews = [] } = useReviews(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;
  const price = Number(product.price) / 100;

  const categoryKey = product.category as unknown as string;
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? "";
  const categoryColor = CATEGORY_COLORS[categoryKey] ?? "bg-muted-foreground";

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    if (next) {
      toast.success("Added to wishlist!");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -6, scale: 1.018 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onProductClick}
      className="bg-white rounded-xl border border-border shadow-xs hover:shadow-card-hover transition-shadow duration-300 overflow-hidden group cursor-pointer"
      data-ocid={`products.item.${index}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x400/EEF5FB/1E73E8?text=No+Image";
          }}
        />

        {/* Category badge */}
        {categoryLabel && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${categoryColor} shadow-sm`}
          >
            {categoryLabel}
          </span>
        )}

        {product.isSold && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <Badge className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-1.5">
              SOLD
            </Badge>
          </div>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs transition-transform hover:scale-110"
          data-ocid="products.toggle"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewSeller();
          }}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-1.5 truncate max-w-full text-left"
          data-ocid="products.seller_link"
        >
          <span className="truncate">
            {product.seller?.toString().slice(0, 8) ?? "Seller"}…
          </span>
          {isVerifiedSeller && (
            <span className="inline-flex items-center gap-0.5 ml-0.5 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Verified</span>
            </span>
          )}
        </button>
        <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-1.5">
          {product.title}
        </h3>
        <div className="flex items-center gap-0.5 mb-0.5">
          {STARS.map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${
                s <= Math.round(avgRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {reviews.length > 0 ? avgRating.toFixed(1) : "No reviews"}
          </span>
          {reviews.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({reviews.length})
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewReviews();
          }}
          className="text-xs text-primary hover:underline mb-2.5 block"
          data-ocid="products.link"
        >
          {reviews.length > 0 ? "See all reviews" : "Be the first to review"}
        </button>
        <div className="text-lg font-bold text-foreground mb-3">
          ${price.toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow();
            }}
            disabled={product.isSold}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs font-semibold"
            data-ocid="products.primary_button"
          >
            Buy Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={product.isSold}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-full text-xs border-primary text-primary hover:bg-secondary"
            data-ocid="products.secondary_button"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
