import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Identity } from "@icp-sdk/core/agent";
import { Loader2, LogIn, Send, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useProductMessages,
  useSendMarketplaceMessage,
} from "../hooks/useQueries";
import type { Product } from "../hooks/useQueries";

interface ProductChatModalProps {
  product: Product;
  onClose: () => void;
  onLeaveReview?: (product: Product) => void;
  identity?: Identity;
  fromBuyNow?: boolean;
}

export default function ProductChatModal({
  product,
  onClose,
  onLeaveReview,
  identity,
  fromBuyNow = false,
}: ProductChatModalProps) {
  const { login } = useInternetIdentity();

  const isIdentityAuthenticated =
    !!identity && !identity.getPrincipal().isAnonymous();
  const derivedSenderName = isIdentityAuthenticated
    ? `${identity!.getPrincipal().toString().slice(0, 8)}…`
    : "";

  const [senderName, setSenderName] = useState(() =>
    isIdentityAuthenticated ? derivedSenderName : "",
  );
  const [message, setMessage] = useState("");
  const [nameSet, setNameSet] = useState(() => isIdentityAuthenticated);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);

  const { data: messages = [], isLoading } = useProductMessages(product.id);
  const sendMessage = useSendMarketplaceMessage();

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is a stable mutable ref
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send "interested" message when Buy Now is clicked by an authenticated user
  // and the product has no existing messages (fires once via ref guard)
  // biome-ignore lint/correctness/useExhaustiveDependencies: sendMessage/product/senderName are stable per modal mount
  useEffect(() => {
    if (
      !fromBuyNow ||
      !isIdentityAuthenticated ||
      isLoading ||
      autoSentRef.current
    )
      return;
    autoSentRef.current = true;
    if (messages.length === 0) {
      void sendMessage.mutateAsync({
        productId: product.id,
        sender: senderName,
        text: `Hi! I'm interested in buying ${product.title}. Is it still available?`,
      });
    }
  }, [fromBuyNow, isIdentityAuthenticated, isLoading, messages.length]);

  const handleSend = async () => {
    if (!message.trim() || !senderName.trim()) return;
    await sendMessage.mutateAsync({
      productId: product.id,
      sender: senderName,
      text: message.trim(),
    });
    setMessage("");
  };

  const price = (Number(product.price) / 100).toFixed(2);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md h-[600px] flex flex-col p-0"
        data-ocid="chat.modal"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex gap-3 items-start">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/56x56";
              }}
            />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base truncate">
                {product.title}
              </DialogTitle>
              <p className="text-primary font-bold text-lg">${price}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Unauthenticated + fromBuyNow: prompt to sign in */}
        {!isIdentityAuthenticated && fromBuyNow ? (
          <div
            className="flex-1 flex flex-col items-center justify-center px-8 gap-5 text-center"
            data-ocid="chat.empty_state"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Sign in to message the seller
              </p>
              <p className="text-sm text-muted-foreground">
                You need to be signed in with Internet Identity to contact this
                seller.
              </p>
            </div>
            <Button
              onClick={login}
              className="rounded-full px-8 bg-primary text-primary-foreground"
              data-ocid="chat.primary_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        ) : !nameSet ? (
          /* Name entry screen (unauthenticated, not fromBuyNow) */
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
            <p className="text-foreground font-medium text-center">
              Enter your name to start chatting with the seller
            </p>
            <Input
              data-ocid="chat.input"
              placeholder="Your name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && senderName.trim() && setNameSet(true)
              }
              className="max-w-xs"
            />
            <Button
              onClick={() => senderName.trim() && setNameSet(true)}
              className="bg-primary text-primary-foreground rounded-full px-8"
              data-ocid="chat.primary_button"
            >
              Start Chat
            </Button>
          </div>
        ) : (
          /* Chat view */
          <>
            <ScrollArea className="flex-1 px-4 py-3">
              {isLoading ? (
                <div
                  className="flex justify-center pt-8"
                  data-ocid="chat.loading_state"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div
                  className="text-center text-muted-foreground text-sm py-8"
                  data-ocid="chat.empty_state"
                >
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => {
                    const isMe = msg.sender === senderName;
                    return (
                      <div
                        key={`${msg.timestamp.toString()}-${i}`}
                        className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                        data-ocid={`chat.item.${i + 1}`}
                      >
                        <Avatar className="w-7 h-7 shrink-0">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {msg.sender.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[75%] ${
                            isMe ? "items-end" : "items-start"
                          } flex flex-col gap-0.5`}
                        >
                          <span className="text-xs text-muted-foreground">
                            {msg.sender}
                          </span>
                          <div
                            className={`px-3 py-2 rounded-xl text-sm ${
                              isMe
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-muted text-foreground rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

            <div className="px-4 py-3 border-t border-border space-y-2">
              {onLeaveReview && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50 rounded-full text-xs font-semibold"
                  onClick={() => {
                    onClose();
                    onLeaveReview(product);
                  }}
                  data-ocid="chat.secondary_button"
                >
                  <Star className="w-3 h-3 mr-1.5 fill-yellow-400 text-yellow-400" />
                  Leave a Review
                </Button>
              )}
              <div className="flex gap-2">
                <Input
                  data-ocid="chat.input"
                  placeholder="Type a message…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={sendMessage.isPending || !message.trim()}
                  className="bg-primary text-primary-foreground shrink-0"
                  data-ocid="chat.submit_button"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
