import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquarePlus, Star, UserCircle2 } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../hooks/useQueries";
import { useReviews } from "../hooks/useQueries";

const STARS = [1, 2, 3, 4, 5];

function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 0) return "just now";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

interface ReviewsPanelProps {
  product: Product;
  open: boolean;
  onClose: () => void;
  onLeaveReview: () => void;
}

export default function ReviewsPanel({
  product,
  open,
  onClose,
  onLeaveReview,
}: ReviewsPanelProps) {
  const { data: reviews = [], isLoading } = useReviews(product.id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
  }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden"
        data-ocid="reviews.dialog"
      >
        {/* Product header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/56x56/EEF5FB/1E73E8?text=N/A";
            }}
          />
          <div className="min-w-0">
            <DialogHeader>
              <DialogTitle className="text-left text-base font-semibold leading-tight line-clamp-1">
                {product.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-1.5 mt-1">
              {STARS.map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/40"
                  }`}
                />
              ))}
              {reviews.length > 0 ? (
                <span className="text-sm font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
              ) : null}
              <span className="text-xs text-muted-foreground">
                {reviews.length === 0
                  ? "No reviews yet"
                  : `${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Rating breakdown */}
        {reviews.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex flex-col gap-1">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">
                    {star}
                  </span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{
                        width:
                          reviews.length > 0
                            ? `${(count / reviews.length) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-4 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="mx-4" />

        {/* Reviews list */}
        <ScrollArea className="max-h-72" data-ocid="reviews.list">
          {isLoading ? (
            <div
              className="py-10 text-center text-sm text-muted-foreground"
              data-ocid="reviews.loading_state"
            >
              Loading reviews…
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center" data-ocid="reviews.empty_state">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-medium text-foreground">
                No reviews yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to leave a review!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.map((review, position) => (
                <motion.div
                  key={`${review.reviewer.toString()}-${review.timestamp.toString()}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: position * 0.04 }}
                  className="px-4 py-3"
                  data-ocid={`reviews.item.${position + 1}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UserCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-medium text-foreground font-mono">
                          {review.reviewer.toString().slice(0, 8)}…
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatRelativeTime(review.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {STARS.map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= Number(review.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-foreground/80 leading-snug">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <Button
            onClick={onLeaveReview}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
            data-ocid="reviews.open_modal_button"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Leave a Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
