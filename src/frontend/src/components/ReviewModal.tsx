import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddReview } from "../hooks/useQueries";

interface ReviewModalProps {
  productId: bigint;
  productTitle: string;
  open: boolean;
  onClose: () => void;
}

export default function ReviewModal({
  productId,
  productTitle,
  open,
  onClose,
}: ReviewModalProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const addReview = useAddReview();
  const { identity } = useInternetIdentity();

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    try {
      await addReview.mutateAsync({
        productId,
        rating: BigInt(selectedRating),
        comment,
      });
      toast.success("Review submitted!");
      setSelectedRating(0);
      setComment("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("already")) {
        toast.error("You've already reviewed this product");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    }
  };

  const displayRating = hoveredRating || selectedRating;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="review.modal">
        <DialogHeader>
          <DialogTitle className="text-base">
            Leave a Review for{" "}
            <span className="text-primary">{productTitle}</span>
          </DialogTitle>
        </DialogHeader>

        {!identity ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground text-sm">
              Please sign in to leave a review
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Star selector */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Rating</p>
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoveredRating(0)}
                data-ocid="review.toggle"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    className="p-0.5 transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= displayRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {
                    ["Terrible", "Poor", "Okay", "Good", "Excellent"][
                      selectedRating - 1
                    ]
                  }
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Comment{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </p>
              <Textarea
                data-ocid="review.textarea"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="review.cancel_button"
          >
            Cancel
          </Button>
          {identity && (
            <Button
              onClick={handleSubmit}
              disabled={addReview.isPending || selectedRating === 0}
              className="bg-primary text-primary-foreground"
              data-ocid="review.submit_button"
            >
              {addReview.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Submit Review
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
