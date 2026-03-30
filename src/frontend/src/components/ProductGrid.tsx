import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { motion } from "motion/react";
import type { Product } from "../hooks/useQueries";
import ProductCard from "./ProductCard";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onBuyNow: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  onViewSeller: (seller: Principal) => void;
}

export default function ProductGrid({
  products,
  isLoading,
  hasMore,
  onLoadMore,
  onBuyNow,
  onViewReviews,
  onViewSeller,
}: ProductGridProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Marketplace Listings
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{products.length} items</span>
        </div>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          data-ocid="products.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <div key={k} className="bg-white rounded-xl overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-2" />
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
