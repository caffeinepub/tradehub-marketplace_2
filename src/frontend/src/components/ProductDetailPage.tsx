import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Heart,
  Loader2,
  ShieldCheck,
  ShoppingCart,
  Star,
  UserCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Product } from "../hooks/useQueries";
import {
  ProductCategory,
  useCreateStripeCheckoutSession,
  useReviews,
  useVerifyStripePayment,
} from "../hooks/useQueries";

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

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  onViewSeller: (seller: Principal) => void;
  isVerifiedSeller: boolean;
}

export default function ProductDetailPage({
  product,
  onBack,
  onBuyNow,
  onViewReviews,
  onViewSeller,
  isVerifiedSeller,
}: ProductDetailPageProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(
    product.id,
  );
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const createSession = useCreateStripeCheckoutSession();
  const verifyPayment = useVerifyStripePayment();

  // Stable refs so the mount-only effect doesn't need them in deps
  const actorRef = useRef(actor);
  const productIdRef = useRef(product.id);
  const productPriceRef = useRef(product.price);
  const verifyPaymentRef = useRef(verifyPayment.mutate);
  actorRef.current = actor;
  productIdRef.current = product.id;
  productPriceRef.current = product.price;
  verifyPaymentRef.current = verifyPayment.mutate;

  // Check URL params on mount for Stripe redirect
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams(window.location.search);

    if (params.get("stripe_success") === "1") {
      const sessionId = params.get("session_id");
      const clean = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", clean);

      if (sessionId) {
        verifyPaymentRef.current(sessionId, {
          onSuccess: (verified: boolean) => {
            if (verified) {
              setShowSuccessModal(true);
              if (actorRef.current) {
                (actorRef.current as any)
                  .markProductAsSold(productIdRef.current)
                  .catch(() => {});
                const amountInCents = BigInt(
                  Math.round(Number(productPriceRef.current) * 1.03),
                );
                (actorRef.current as any)
                  .recordPayment(productIdRef.current, sessionId, amountInCents)
                  .catch(() => {});
              }
            } else {
              toast.error("Payment could not be verified. Contact support.");
            }
          },
          onError: () => {
            toast.error("Payment verification failed. Contact support.");
          },
        });
      } else {
        setShowSuccessModal(true);
        if (actorRef.current) {
          (actorRef.current as any)
            .markProductAsSold(productIdRef.current)
            .catch(() => {});
          const amountInCents = BigInt(
            Math.round(Number(productPriceRef.current) * 1.03),
          );
          (actorRef.current as any)
            .recordPayment(productIdRef.current, "", amountInCents)
            .catch(() => {});
        }
      }
    } else if (params.get("stripe_cancel") === "1") {
      const clean = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", clean);
      toast.info("Payment cancelled.");
    }
  }, []);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  const price = Number(product.price) / 100;

  const categoryKey = product.category as unknown as string;
  const categoryLabel = CATEGORY_LABELS[categoryKey] ?? "";
  const categoryColor = CATEGORY_COLORS[categoryKey] ?? "bg-muted-foreground";

  const handleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    if (next) {
      toast.success(`${product.title} added to wishlist!`);
    } else {
      toast.info("Removed from wishlist");
    }
  };

  const handlePayWithCard = () => {
    if (!identity) {
      toast.error("Please sign in to purchase");
      return;
    }

    const base = window.location.origin + window.location.pathname;
    const successUrl = `${base}?stripe_success=1&session_id={CHECKOUT_SESSION_ID}&product_id=${product.id}`;
    const cancelUrl = `${base}?stripe_cancel=1&product_id=${product.id}`;

    createSession.mutate(
      { productId: product.id, successUrl, cancelUrl },
      {
        onSuccess: (url) => {
          window.location.href = url;
        },
        onError: () => {
          toast.error("Payment setup failed. Please try again.");
        },
      },
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
        data-ocid="product_detail.page"
      >
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          data-ocid="product_detail.link"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </motion.button>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-card-hover">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x800/EEF5FB/1E73E8?text=No+Image";
                }}
              />

              {/* Category badge */}
              {categoryLabel && (
                <span
                  className={`absolute top-3 left-3 text-xs font-bold text-white px-3 py-1 rounded-full ${categoryColor} shadow-sm`}
                >
                  {categoryLabel}
                </span>
              )}

              {/* SOLD overlay */}
              {product.isSold && (
                <div className="absolute inset-0 bg-foreground/55 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground text-xl font-black px-8 py-3 rounded-full shadow-lg tracking-widest">
                    SOLD
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Product info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.13,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="flex flex-col gap-4"
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Star rating row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                {STARS.map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              {reviews.length > 0 && (
                <span className="text-sm font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {reviews.length === 0
                  ? "No reviews yet"
                  : `(${reviews.length} review${reviews.length === 1 ? "" : "s"})`}
              </span>
              <button
                type="button"
                onClick={() => onViewReviews(product)}
                className="text-sm text-primary hover:underline ml-0.5 font-medium"
                data-ocid="product_detail.link"
              >
                See all reviews
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold text-primary">
                ${price.toFixed(2)}
              </div>
            </div>

            {/* Seller row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Sold by:</span>
              <button
                type="button"
                onClick={() => product.seller && onViewSeller(product.seller)}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                data-ocid="product_detail.link"
              >
                <span className="font-mono">
                  {product.seller?.toString().slice(0, 8) ?? "Seller"}…
                </span>
                {isVerifiedSeller && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">Verified</span>
                  </span>
                )}
              </button>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                Description
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <Button
                size="lg"
                onClick={() => onBuyNow(product)}
                disabled={product.isSold}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold text-base shadow-card"
                data-ocid="product_detail.primary_button"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.isSold ? "Sold Out" : "Buy Now"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
                className={`rounded-full border-2 px-5 transition-colors ${
                  wishlisted
                    ? "border-red-400 text-red-500 hover:bg-red-50"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
                data-ocid="product_detail.toggle"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Pay with Card button */}
            {!product.isSold && (
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  onClick={handlePayWithCard}
                  disabled={createSession.isPending}
                  className="w-full rounded-full font-semibold text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md border-0"
                  data-ocid="product_detail.secondary_button"
                >
                  {createSession.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2" />
                  )}
                  {createSession.isPending
                    ? "Redirecting to checkout…"
                    : "Pay with Card"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Includes 3% platform fee · Secure payment via Stripe
                  <span className="ml-1 inline-flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">
                      SSL encrypted
                    </span>
                  </span>
                </p>
              </div>
            )}

            <Separator />

            {/* Inline reviews section */}
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">
                Customer Reviews
              </h2>

              {reviewsLoading ? (
                <div
                  className="py-6 text-center text-sm text-muted-foreground"
                  data-ocid="product_detail.loading_state"
                >
                  Loading reviews…
                </div>
              ) : reviews.length === 0 ? (
                <div
                  className="py-8 text-center rounded-xl bg-muted/40 border border-dashed border-border"
                  data-ocid="product_detail.empty_state"
                >
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-sm font-medium text-foreground">
                    No reviews yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first to leave a review!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review, position) => (
                    <motion.div
                      key={`${review.reviewer.toString()}-${review.timestamp.toString()}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: position * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border"
                      data-ocid={`product_detail.item.${position + 1}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserCircle2 className="w-5 h-5 text-primary" />
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
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {STARS.map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent
          className="sm:max-w-md text-center"
          data-ocid="product_detail.dialog"
        >
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center">
              Payment Successful! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Your purchase of{" "}
              <span className="font-semibold text-foreground">
                {product.title}
              </span>{" "}
              is confirmed. The seller has been notified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                onBack();
              }}
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
              data-ocid="product_detail.confirm_button"
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
