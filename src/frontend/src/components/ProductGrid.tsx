import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { motion } from "motion/react";
import type { Product } from "../hooks/useQueries";
import ProductCard from "./ProductCard";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

const RATING_FILTERS: { label: string; value: number | null }[] = [
  { label: "All", value: null },
  { label: "3★+", value: 3 },
  { label: "4★+", value: 4 },
  { label: "5★", value: 5 },
];

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onBuyNow: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  onViewSeller: (seller: Principal) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  sellerRatingsMap: Map<
    string,
    { avg: number; count: number; isVerified: boolean }
  >;
  minSellerRating: number | null;
  onMinSellerRatingChange: (rating: number | null) => void;
  categoryLabel?: string;
}

export default function ProductGrid({
  products,
  isLoading,
  hasMore,
  onLoadMore,
  onBuyNow,
  onViewReviews,
  onViewSeller,
  onProductClick,
  onAddToCart,
  sellerRatingsMap,
  minSellerRating,
  onMinSellerRatingChange,
  categoryLabel,
}: ProductGridProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        {categoryLabel ? (
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">
              {categoryLabel} Listings
            </h2>
            <span className="text-sm text-muted-foreground">
              ({products.length} items)
            </span>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-foreground">
              Marketplace Listings
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{products.length} items</span>
            </div>
          </>
        )}
      </div>

      {/* Seller rating filter */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-muted-foreground font-medium mr-1">
          Seller rating:
        </span>
        {RATING_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => onMinSellerRatingChange(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              minSellerRating === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
            data-ocid="products.filter.tab"
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="products.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <div
              key={k}
              className="bg-white rounded-xl overflow-hidden border border-border"
            >
              <Skeleton className="aspect-square w-full animate-pulse" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4 animate-pulse" />
                <Skeleton className="h-3 w-1/2 animate-pulse" />
                <Skeleton className="h-3 w-2/3 animate-pulse" />
                <Skeleton className="h-9 w-full mt-2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="text-center py-20 bg-white rounded-xl border border-border"
          data-ocid="products.empty_state"
        >
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-foreground font-medium">No products found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try a different search or category
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          data-ocid="products.list"
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              index={i + 1}
              onBuyNow={() => onBuyNow(product)}
              onViewReviews={() => onViewReviews(product)}
              onViewSeller={() =>
                product.seller && onViewSeller(product.seller)
              }
              onProductClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart(product)}
              isVerifiedSeller={
                sellerRatingsMap.get(product.seller.toString())?.isVerified ??
                false
              }
            />
          ))}
        </motion.div>
      )}

      {hasMore && !isLoading && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="rounded-full px-8 border-primary text-primary hover:bg-secondary"
            data-ocid="products.primary_button"
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
