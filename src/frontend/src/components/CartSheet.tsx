import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "../hooks/useQueries";

interface CartSheetProps {
  cartItems: Product[];
  onRemoveFromCart: (id: bigint) => void;
  onClearCart: () => void;
  onBuyNow: (product: Product) => void;
}

export default function CartSheet({
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onBuyNow,
}: CartSheetProps) {
  const [open, setOpen] = useState(false);
  const total = cartItems.reduce((sum, p) => sum + Number(p.price) / 100, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-secondary"
          data-ocid="cart.open_modal_button"
        >
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white border-2 border-white rounded-full">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="flex flex-row items-center justify-between pr-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({cartItems.length})
          </SheetTitle>
          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              className="text-destructive hover:text-destructive text-xs"
              data-ocid="cart.delete_button"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </SheetHeader>

        <Separator className="my-2" />

        {cartItems.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16"
            data-ocid="cart.empty_state"
          >
            <ShoppingCart className="w-12 h-12 text-muted-foreground/40" />
            <p className="font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add items from the marketplace to get started
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3 py-2">
                {cartItems.map((item, i) => (
                  <div
                    key={item.id.toString()}
                    className="flex gap-3 bg-muted/40 rounded-xl p-3 items-center"
                    data-ocid={`cart.item.${i + 1}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/64x64/EEF5FB/1E73E8?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <p className="text-sm font-bold text-primary mt-0.5">
                        ${(Number(item.price) / 100).toFixed(2)}
                      </p>
                      <Button
                        size="sm"
                        className="mt-2 h-7 text-xs rounded-full bg-primary text-primary-foreground"
                        onClick={() => {
                          onBuyNow(item);
                          setOpen(false);
                        }}
                        data-ocid="cart.primary_button"
                      >
                        Buy Now
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      data-ocid="cart.delete_button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-3" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-lg text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
