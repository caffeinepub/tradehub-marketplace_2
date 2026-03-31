import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Principal } from "@icp-sdk/core/principal";
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Star,
  UserCircle2,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import type { Product } from "../hooks/useQueries";
import { useAllProductReviews, useAllProducts } from "../hooks/useQueries";

interface AdminPanelProps {
  onBack: () => void;
  manuallyVerified: Set<string>;
  onVerifiedChange: (seller: Principal, verified: boolean) => void;
}

export default function AdminPanel({
  onBack,
  manuallyVerified,
  onVerifiedChange,
}: AdminPanelProps) {
  const { data: allProducts = [] } = useAllProducts();
  const { actor } = useActor();
  const [loading, setLoading] = useState<string | null>(null);
  const [principalInput, setPrincipalInput] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [stripeKey, setStripeKey] = useState("");
  const [savingStripe, setSavingStripe] = useState(false);

  const productIds = useMemo(() => allProducts.map((p) => p.id), [allProducts]);
  const { data: allReviewsMap = new Map() } = useAllProductReviews(productIds);

  // Build unique sellers with stats
  const sellers = useMemo(() => {
    const map = new Map<
      string,
      {
        principal: Principal;
        avg: number;
        count: number;
        activeListings: number;
        soldListings: number;
      }
    >();
    for (const product of allProducts) {
      const key = product.seller.toString();
      if (!map.has(key)) {
        map.set(key, {
          principal: product.seller,
          avg: 0,
          count: 0,
          activeListings: 0,
          soldListings: 0,
        });
      }
      const entry = map.get(key)!;
      if (product.isSold) entry.soldListings++;
      else entry.activeListings++;
      const reviews = allReviewsMap.get(product.id.toString()) ?? [];
      for (const r of reviews) {
        entry.count++;
        entry.avg =
          (entry.avg * (entry.count - 1) + Number(r.rating)) / entry.count;
      }
    }
    return Array.from(map.values());
  }, [allProducts, allReviewsMap]);

  const handleToggle = async (sellerPrincipal: Principal, checked: boolean) => {
    if (!actor) return;
    const key = sellerPrincipal.toString();
    setLoading(key);
    try {
      await (actor as any).setSellerVerified(sellerPrincipal, checked);
      onVerifiedChange(sellerPrincipal, checked);
      toast.success(checked ? "Seller verified" : "Verification revoked");
    } catch (_e) {
      toast.error("Failed to update verified status");
    } finally {
      setLoading(null);
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!actor || !principalInput.trim()) return;
    setPromoting(true);
    try {
      const principal = Principal.fromText(principalInput.trim());
      await actor.assignCallerUserRole(principal, UserRole.admin);
      toast.success("User promoted to admin");
      setPrincipalInput("");
    } catch (_e) {
      toast.error(
        "Failed to promote user. Check that the principal ID is valid.",
      );
    } finally {
      setPromoting(false);
    }
  };

  const handleSaveStripeKey = async () => {
    if (!actor || !stripeKey.trim()) return;
    setSavingStripe(true);
    try {
      await (actor as any).setStripeSecretKey(stripeKey.trim());
      toast.success("Stripe key saved!");
      setStripeKey("");
    } catch (_e) {
      toast.error("Failed to save Stripe key.");
    } finally {
      setSavingStripe(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground"
          data-ocid="admin.back.button"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Admin Controls
        </Badge>
      </div>

      {/* Stripe Configuration Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-foreground">
            Stripe Configuration
          </h2>
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-700 ml-auto text-xs"
          >
            Payments
          </Badge>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your Stripe secret key to enable credit and debit card
            payments. TradeHub charges a
            <span className="font-semibold text-foreground">
              {" "}
              3% platform fee
            </span>{" "}
            on each transaction.
          </p>
          <div className="flex gap-3">
            <Input
              type="password"
              placeholder="sk_live_... or sk_test_..."
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
              className="font-mono text-sm flex-1"
              data-ocid="admin.stripe.input"
            />
            <Button
              onClick={handleSaveStripeKey}
              disabled={!stripeKey.trim() || savingStripe}
              className="shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0"
              data-ocid="admin.stripe.save_button"
            >
              {savingStripe ? "Saving…" : "Save Key"}
            </Button>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
            <span>
              Your Stripe secret key is stored securely on-chain.{" "}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
              >
                Get your key from dashboard.stripe.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Management Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Admin Management</h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste a user&apos;s principal ID below to promote them to admin.
            Note: demoting admins is not supported from this UI.
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="Principal ID (e.g. aaaaa-aa)"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="font-mono text-sm"
              data-ocid="admin.promote.input"
            />
            <Button
              onClick={handlePromoteToAdmin}
              disabled={!principalInput.trim() || promoting}
              className="shrink-0"
              data-ocid="admin.promote.primary_button"
            >
              {promoting ? "Promoting…" : "Promote to Admin"}
            </Button>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            ⚠️ Demoting admins is not supported from this panel. Contact a system
            administrator to revoke admin access.
          </p>
        </div>
      </div>

      {/* Verified Seller Management Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-foreground">
            Verified Seller Management
          </h2>
        </div>
        <div className="p-4 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Toggle verified status for sellers. Auto-verified sellers (4★+ with
            3+ reviews) are shown with a star icon. Manual overrides take
            precedence.
          </p>
        </div>
        <ScrollArea className="max-h-[600px]">
          {sellers.length === 0 ? (
            <div
              className="py-16 text-center text-muted-foreground"
              data-ocid="admin.sellers.empty_state"
            >
              No sellers yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sellers.map((seller, idx) => {
                const key = seller.principal.toString();
                const isManuallyVerified = manuallyVerified.has(key);
                const isAutoVerified = seller.avg >= 4.0 && seller.count >= 3;
                const isVerified = isManuallyVerified || isAutoVerified;
                const isToggling = loading === key;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                    data-ocid={`admin.sellers.item.${idx + 1}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono text-foreground truncate max-w-[220px]">
                          {key.slice(0, 20)}…
                        </span>
                        {isVerified && (
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs text-blue-500 font-medium">
                              Verified
                            </span>
                          </div>
                        )}
                        {isAutoVerified && (
                          <Badge
                            variant="outline"
                            className="text-xs border-yellow-400 text-yellow-600 px-1.5 py-0"
                          >
                            Auto
                          </Badge>
                        )}
                        {isManuallyVerified && (
                          <Badge
                            variant="outline"
                            className="text-xs border-blue-400 text-blue-600 px-1.5 py-0"
                          >
                            Manual
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                        <span>
                          {seller.activeListings} active · {seller.soldListings}{" "}
                          sold
                        </span>
                        {seller.count > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {seller.avg.toFixed(1)} ({seller.count} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {isManuallyVerified ? "Revoke" : "Grant"}
                      </span>
                      <Switch
                        checked={isManuallyVerified}
                        onCheckedChange={(checked) =>
                          handleToggle(seller.principal, checked)
                        }
                        disabled={isToggling}
                        aria-label="Toggle verified status"
                        data-ocid={`admin.sellers.toggle.${idx + 1}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
