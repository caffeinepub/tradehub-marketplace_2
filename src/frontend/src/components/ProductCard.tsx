import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../hooks/useQueries";
import { useReviews } from "../hooks/useQueries";

const STARS = [1, 2, 3, 4, 5];

interface ProductCardProps {
  product: Product;
  index: number;
  onBuyNow: () => void;
  onViewReviews: () => void;
  onViewSeller: () => void;
}

export default function ProductCard({
  product,
  index,
  onBuyNow,
  onViewReviews,
  onViewSeller,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { data: reviews = [] } = useReviews(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;
  const price = Number(product.price) / 100;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white rounded-xl border border-border shadow-xs hover:shadow-card-hover transition-shadow duration-300 overflow-hidden group"
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
        {product.isSold && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <Badge className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-1.5">
              SOLD
            </Badge>
          </div>
        )}
        <button
          type="button"
          onClick={() => setWishlisted((w) => !w)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs transition-transform hover:scale-110"
          data-ocid="products.toggle"
        >
          <Heart
            className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onViewSeller}
          className="text-xs text-primary hover:underline mb-1 block truncate max-w-full text-left"
          data-ocid="products.seller_link"
        >
          {product.seller?.toString().slice(0, 8) ?? "Seller"}…
        </button>
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-0.5">
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
          onClick={onViewReviews}
          className="text-xs text-primary hover:underline mb-2 block"
          data-ocid="products.link"
        >
          {reviews.length > 0 ? "See all reviews" : "Be the first to review"}
        </button>
        <div className="text-base font-bold text-foreground mb-3">
          ${price.toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onBuyNow}
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
