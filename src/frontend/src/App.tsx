import { Toaster } from "@/components/ui/sonner";
import type { Principal } from "@icp-sdk/core/principal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "./backend.d";
import AdminPanel from "./components/AdminPanel";
import BottomContent from "./components/BottomContent";
import CategoryPicks from "./components/CategoryPicks";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InfoModal from "./components/InfoModal";
import LiveSupportChat from "./components/LiveSupportChat";
import MyListings from "./components/MyListings";
import NavBar from "./components/NavBar";
import ProductChatModal from "./components/ProductChatModal";
import ProductDetailPage from "./components/ProductDetailPage";
import ProductGrid from "./components/ProductGrid";
import RegisterModal from "./components/RegisterModal";
import ReviewModal from "./components/ReviewModal";
import ReviewsPanel from "./components/ReviewsPanel";
import SellModal from "./components/SellModal";
import SellerInbox from "./components/SellerInbox";
import SellerProfilePanel from "./components/SellerProfilePanel";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  ProductCategory,
  useAllProductReviews,
  useAllProducts,
  useCreateProduct,
  useMyMessageCount,
  useProductsByCategory,
} from "./hooks/useQueries";
import type { Product } from "./hooks/useQueries";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  [ProductCategory.electronics]: "Electronics",
  [ProductCategory.fashion]: "Fashion",
  [ProductCategory.home]: "Home",
  [ProductCategory.sports]: "Sports",
  [ProductCategory.hobbies]: "Hobbies",
  [ProductCategory.autos]: "Autos",
};

const SAMPLE_PRODUCTS = [
  {
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise cancelling wireless headphones with 30hr battery life.",
    price: 29900n,
    category: ProductCategory.electronics,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    sellerId: "Alice M.",
  },
  {
    title: "Nike Air Max 270",
    description:
      "Stylish and comfortable running shoes with Air Max cushioning system.",
    price: 15000n,
    category: ProductCategory.fashion,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    sellerId: "Bob T.",
  },
  {
    title: "Modern L-Shaped Sofa",
    description:
      "Plush sectional sofa in premium fabric, seats up to 6 people comfortably.",
    price: 89900n,
    category: ProductCategory.home,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    sellerId: "Carol S.",
  },
  {
    title: "Peloton Bike+ Indoor Cycling",
    description:
      "Smart exercise bike with live & on-demand classes, 24-inch HD touchscreen.",
    price: 129900n,
    category: ProductCategory.sports,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    sellerId: "David K.",
  },
  {
    title: "MacBook Pro 14-inch M3",
    description:
      "Apple M3 chip, 18-hour battery, Liquid Retina XDR display. Like new condition.",
    price: 169900n,
    category: ProductCategory.electronics,
    imageUrl:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    sellerId: "Eve R.",
  },
  {
    title: "2021 Toyota Camry SE",
    description:
      "35,000 miles, one owner, clean title, backup camera, Apple CarPlay.",
    price: 2499900n,
    category: ProductCategory.autos,
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400",
    sellerId: "Frank L.",
  },
  {
    title: "LEGO Architecture Skyline",
    description:
      "New York City skyline set with 598 pieces. Perfect for display or gifting.",
    price: 5900n,
    category: ProductCategory.hobbies,
    imageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
    sellerId: "Grace H.",
  },
  {
    title: "Vintage Leather Jacket",
    description:
      "Genuine brown leather motorcycle jacket, size M. 90s classic, barely worn.",
    price: 18500n,
    category: ProductCategory.fashion,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    sellerId: "Henry P.",
  },
  {
    title: "Dyson V15 Detect Vacuum",
    description:
      "Cordless vacuum with laser dust detection and HEPA filtration. 60-min runtime.",
    price: 64900n,
    category: ProductCategory.home,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    sellerId: "Iris W.",
  },
  {
    title: "Wilson Pro Tennis Racket",
    description:
      "Carbon fiber frame, 100sq in head. Used one season, excellent condition.",
    price: 18900n,
    category: ProductCategory.sports,
    imageUrl:
      "https://images.unsplash.com/photo-1617083934555-ac56ed1c3118?w=400",
    sellerId: "Jack M.",
  },
];

export default function App() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const { data: products = [], isLoading: productsLoading } = useAllProducts();
  const createProduct = useCreateProduct();
  const { data: myMessageCount = 0 } = useMyMessageCount();

  const { data: allReviewsMap = new Map() } = useAllProductReviews(
    products.map((p) => p.id),
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [manuallyVerified, setManuallyVerified] = useState<Set<string>>(
    new Set(),
  );

  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const alreadyIn = prev.some((p) => p.id === product.id);
      if (alreadyIn) {
        toast.info("Already in cart!");
        return prev;
      }
      toast.success("Added to cart!");
      return [...prev, product];
    });
  }, []);

  const removeFromCart = useCallback((productId: bigint) => {
    setCartItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Sort mode
  const [sortMode, setSortMode] = useState<"trending" | "deals" | null>(null);

  // Support chat open state
  const [supportChatOpen, setSupportChatOpen] = useState(false);

  const [infoModalType, setInfoModalType] = useState<string | null>(null);

  // Load admin status and manual verified list
  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as any)
      .isCallerAdmin()
      .then((admin: boolean) => {
        setIsAdmin(admin);
      })
      .catch(() => {});
    (actor as any)
      .getManuallyVerifiedSellers()
      .then((principals: Principal[]) => {
        setManuallyVerified(new Set(principals.map((p) => p.toString())));
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const sellerRatingsMap = useMemo(() => {
    const map = new Map<
      string,
      { avg: number; count: number; isVerified: boolean }
    >();
    for (const product of products) {
      const sellerKey = product.seller.toString();
      const reviews = allReviewsMap.get(product.id.toString()) ?? [];
      if (!map.has(sellerKey)) {
        map.set(sellerKey, { avg: 0, count: 0, isVerified: false });
      }
      const entry = map.get(sellerKey)!;
      for (const r of reviews) {
        entry.count += 1;
        entry.avg =
          (entry.avg * (entry.count - 1) + Number(r.rating)) / entry.count;
      }
    }
    for (const [key, entry] of map) {
      const autoVerified = entry.avg >= 4.0 && entry.count >= 3;
      const manualVerified = manuallyVerified.has(key);
      entry.isVerified = autoVerified || manualVerified;
    }
    return map;
  }, [products, allReviewsMap, manuallyVerified]);

  const [seeded, setSeeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSellerInbox, setShowSellerInbox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [reviewsPanelProduct, setReviewsPanelProduct] =
    useState<Product | null>(null);
  const [sellerProfilePrincipal, setSellerProfilePrincipal] =
    useState<Principal | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [minSellerRating, setMinSellerRating] = useState<number | null>(null);

  const { data: categoryProducts = [], isLoading: categoryLoading } =
    useProductsByCategory(selectedCategory);

  const activeProducts = selectedCategory ? categoryProducts : products;
  const activeLoading = selectedCategory ? categoryLoading : productsLoading;

  const activeCategoryLabel = selectedCategory
    ? CATEGORY_LABEL_MAP[selectedCategory as unknown as string]
    : undefined;

  const prevIdentityRef = useRef<typeof identity>(undefined);
  useEffect(() => {
    const wasLoggedOut = !prevIdentityRef.current;
    const isNowLoggedIn = !!identity;
    prevIdentityRef.current = identity;

    if (wasLoggedOut && isNowLoggedIn && actor) {
      const principal = identity!.getPrincipal();
      actor.assignCallerUserRole(principal, UserRole.user).catch(() => {});

      // Check if this is a new user (no profile yet) or signup intent
      const signupIntent =
        sessionStorage.getItem("tradehub_signup_intent") === "true";
      sessionStorage.removeItem("tradehub_signup_intent");

      if (signupIntent) {
        // Always show registration for signup intent
        setShowRegisterModal(true);
      } else {
        // Check if they have a profile; show modal if not
        actor
          .getCallerUserProfile()
          .then((profile) => {
            if (!profile) {
              setShowRegisterModal(true);
            }
          })
          .catch(() => {});
      }
    }
  }, [identity, actor]);

  const seedProducts = useCallback(async () => {
    if (!actor || seeded || productsLoading) return;
    if (products.length > 0) {
      setSeeded(true);
      return;
    }
    setSeeded(true);
    for (const p of SAMPLE_PRODUCTS) {
      await createProduct.mutateAsync(p);
    }
  }, [actor, seeded, productsLoading, products.length, createProduct]);

  useEffect(() => {
    if (!isFetching && !productsLoading && !seeded) {
      seedProducts();
    }
  }, [isFetching, productsLoading, seeded, seedProducts]);

  const handleSellClick = () => {
    if (!identity) {
      toast.info("Please sign in to create a listing");
      login();
      return;
    }
    setShowSellModal(true);
  };

  const filteredProducts = useMemo(() => {
    let result = activeProducts.filter((p) => {
      const matchesSearch = searchQuery
        ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesRating = minSellerRating
        ? (sellerRatingsMap.get(p.seller.toString())?.avg ?? 0) >=
          minSellerRating
        : true;
      return matchesSearch && matchesRating;
    });

    if (sortMode === "trending") {
      result = [...result].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );
    } else if (sortMode === "deals") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    return result;
  }, [
    activeProducts,
    searchQuery,
    minSellerRating,
    sellerRatingsMap,
    sortMode,
  ]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  const handleVerifiedChange = (seller: Principal, verified: boolean) => {
    setManuallyVerified((prev) => {
      const next = new Set(prev);
      if (verified) next.add(seller.toString());
      else next.delete(seller.toString());
      return next;
    });
  };

  const handleTrendingClick = () => {
    setSortMode((prev) => (prev === "trending" ? null : "trending"));
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDealsClick = () => {
    setSortMode((prev) => (prev === "deals" ? null : "deals"));
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  // Navigate away from inbox/listings/admin when identity is lost
  useEffect(() => {
    if (!identity) {
      setShowSellerInbox(false);
    }
  }, [identity]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMyListingsClick={() => {
          setShowMyListings(true);
          setShowAdminPanel(false);
          setShowSellerInbox(false);
          setSelectedProduct(null);
        }}
        onMessagesClick={
          identity
            ? () => {
                setShowSellerInbox(true);
                setShowMyListings(false);
                setShowAdminPanel(false);
                setSelectedProduct(null);
              }
            : undefined
        }
        isAdmin={isAdmin}
        onAdminClick={() => {
          setShowAdminPanel(true);
          setShowMyListings(false);
          setShowSellerInbox(false);
          setSelectedProduct(null);
        }}
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onBuyNow={(product) => setChatProduct(product)}
        hasMessages={myMessageCount > 0}
      />
      <NavBar
        onSellClick={handleSellClick}
        onExploreClick={() =>
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        onTrendingClick={handleTrendingClick}
        onDealsClick={handleDealsClick}
        onHelpClick={() => setSupportChatOpen(true)}
        activeSortMode={sortMode}
      />

      {showAdminPanel ? (
        <main>
          <AdminPanel
            onBack={() => setShowAdminPanel(false)}
            manuallyVerified={manuallyVerified}
            onVerifiedChange={handleVerifiedChange}
          />
        </main>
      ) : showMyListings ? (
        <main>
          <MyListings onBack={() => setShowMyListings(false)} />
        </main>
      ) : showSellerInbox ? (
        <main>
          <SellerInbox
            onBack={() => setShowSellerInbox(false)}
            identity={identity}
            onLeaveReview={(product) => {
              setShowSellerInbox(false);
              setReviewProduct(product);
            }}
          />
        </main>
      ) : selectedProduct ? (
        <main>
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onBuyNow={(product) => setChatProduct(product)}
            onViewReviews={(product) => setReviewsPanelProduct(product)}
            onViewSeller={(seller) => setSellerProfilePrincipal(seller)}
            isVerifiedSeller={
              sellerRatingsMap.get(selectedProduct.seller.toString())
                ?.isVerified ?? false
            }
          />
        </main>
      ) : (
        <main>
          <Hero
            onShopNow={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            onSellClick={handleSellClick}
          />
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryPicks
              selected={selectedCategory}
              onSelect={(cat) => {
                setSelectedCategory(cat);
                setDisplayCount(8);
                setSortMode(null);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            <div id="products">
              <ProductGrid
                products={displayedProducts}
                isLoading={activeLoading}
                hasMore={displayCount < filteredProducts.length}
                onLoadMore={() => setDisplayCount((c) => c + 8)}
                onBuyNow={(product) => setChatProduct(product)}
                onViewReviews={(product) => setReviewsPanelProduct(product)}
                onViewSeller={(seller) => setSellerProfilePrincipal(seller)}
                onProductClick={(product) => setSelectedProduct(product)}
                onAddToCart={addToCart}
                sellerRatingsMap={sellerRatingsMap}
                minSellerRating={minSellerRating}
                onMinSellerRatingChange={(r) => {
                  setMinSellerRating(r);
                  setDisplayCount(8);
                }}
                categoryLabel={activeCategoryLabel}
              />
            </div>
            <BottomContent
              onSellClick={handleSellClick}
              onBlogPostClick={() => setInfoModalType("blog")}
            />
          </div>
        </main>
      )}

      <Footer
        onLinkClick={(type) => setInfoModalType(type)}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat as any);
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        onHelpClick={() => setSupportChatOpen(true)}
      />

      <SellModal open={showSellModal} onClose={() => setShowSellModal(false)} />

      {chatProduct && (
        <ProductChatModal
          product={chatProduct}
          onClose={() => setChatProduct(null)}
          onLeaveReview={(product) => {
            setChatProduct(null);
            setReviewProduct(product);
          }}
          identity={identity}
          fromBuyNow={true}
        />
      )}

      {reviewProduct && (
        <ReviewModal
          productId={reviewProduct.id}
          productTitle={reviewProduct.title}
          open={!!reviewProduct}
          onClose={() => setReviewProduct(null)}
        />
      )}

      {reviewsPanelProduct && (
        <ReviewsPanel
          product={reviewsPanelProduct}
          open={!!reviewsPanelProduct}
          onClose={() => setReviewsPanelProduct(null)}
          onLeaveReview={() => {
            setReviewsPanelProduct(null);
            setReviewProduct(reviewsPanelProduct);
          }}
        />
      )}

      <SellerProfilePanel
        sellerPrincipal={sellerProfilePrincipal}
        open={!!sellerProfilePrincipal}
        onClose={() => setSellerProfilePrincipal(null)}
        onBuyNow={(product) => setChatProduct(product)}
        sellerStats={
          sellerProfilePrincipal
            ? sellerRatingsMap.get(sellerProfilePrincipal.toString())
            : undefined
        }
      />

      <InfoModal type={infoModalType} onClose={() => setInfoModalType(null)} />

      <RegisterModal
        open={showRegisterModal}
        onComplete={() => setShowRegisterModal(false)}
      />

      <LiveSupportChat
        forceOpen={supportChatOpen}
        onForceOpenHandled={() => setSupportChatOpen(false)}
      />
      <Toaster />
    </div>
  );
}
