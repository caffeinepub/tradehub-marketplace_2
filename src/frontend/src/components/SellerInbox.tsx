import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Identity } from "@icp-sdk/core/agent";
import { ArrowLeft, MessageSquare, Package } from "lucide-react";
import { useState } from "react";
import { useMyProducts, useProductMessages } from "../hooks/useQueries";
import type { Product } from "../hooks/useQueries";
import ProductChatModal from "./ProductChatModal";

interface ConversationCardProps {
  product: Product;
  idx: number;
  identity?: Identity;
  onLeaveReview?: (product: Product) => void;
}

function ConversationCard({
  product,
  idx,
  identity,
  onLeaveReview,
}: ConversationCardProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const { data: messages = [], isLoading: messagesLoading } =
    useProductMessages(product.id);

  const latestMsg = messages[messages.length - 1];
  const messageCount = messages.length;
  const price = (Number(product.price) / 100).toFixed(2);

  return (
    <>
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 hover:border-primary/30 transition-all text-left group"
        data-ocid={`inbox.item.${idx + 1}`}
      >
        {/* Thumbnail */}
        <div className="relative shrink-0">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-14 h-14 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/56x56";
            }}
          />
          {product.isSold && (
            <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-wide">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-sm text-foreground truncate flex-1">
              {product.title}
            </h3>
            {messageCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 shrink-0 h-5">
                {messageCount}
              </Badge>
            )}
          </div>
          <p className="text-xs font-bold text-primary mb-1">${price}</p>
          <p className="text-xs text-muted-foreground truncate">
            {messagesLoading ? (
              <span className="italic">Loading…</span>
            ) : latestMsg ? (
              <>
                <span className="font-medium text-foreground/70">
                  {latestMsg.sender}:
                </span>{" "}
                {latestMsg.text}
              </>
            ) : (
              <span className="italic">No messages yet</span>
            )}
          </p>
        </div>

        {/* Chat icon */}
        <MessageSquare
          className={`w-4 h-4 shrink-0 transition-colors ${
            messageCount > 0
              ? "text-primary"
              : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
          }`}
        />
      </button>

      {chatOpen && (
        <ProductChatModal
          product={product}
          onClose={() => setChatOpen(false)}
          identity={identity}
          onLeaveReview={onLeaveReview}
        />
      )}
    </>
  );
}

interface SellerInboxProps {
  onBack: () => void;
  identity?: Identity;
  onLeaveReview?: (product: Product) => void;
}

export default function SellerInbox({
  onBack,
  identity,
  onLeaveReview,
}: SellerInboxProps) {
  const { data: products = [], isLoading } = useMyProducts();

  return (
    <section className="max-w-[680px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2"
          data-ocid="inbox.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            Buyer inquiries across your listings
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3" data-ocid="inbox.loading_state">
          {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((key) => (
            <div
              key={key}
              className="flex items-center gap-4 p-4 rounded-xl border border-border"
            >
              <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No listings empty state */}
      {!isLoading && products.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="inbox.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No listings yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create a listing to start receiving buyer messages.
          </p>
          <Button
            onClick={onBack}
            className="rounded-full"
            data-ocid="inbox.primary_button"
          >
            Go to Marketplace
          </Button>
        </div>
      )}

      {/* Conversation list */}
      {!isLoading && products.length > 0 && (
        <div className="flex flex-col gap-3" data-ocid="inbox.list">
          {products.map((product, idx) => (
            <ConversationCard
              key={product.id.toString()}
              product={product}
              idx={idx}
              identity={identity}
              onLeaveReview={onLeaveReview}
            />
          ))}
        </div>
      )}
    </section>
  );
}
