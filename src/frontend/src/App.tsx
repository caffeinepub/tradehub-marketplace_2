import { Toaster } from "@/components/ui/sonner";
import type { Principal } from "@icp-sdk/core/principal";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "./backend.d";
import BottomContent from "./components/BottomContent";
import CategoryPicks from "./components/CategoryPicks";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LiveSupportChat from "./components/LiveSupportChat";
import MyListings from "./components/MyListings";
import NavBar from "./components/NavBar";
import ProductChatModal from "./components/ProductChatModal";
import ProductGrid from "./components/ProductGrid";
import ReviewModal from "./components/ReviewModal";
import ReviewsPanel from "./components/ReviewsPanel";
import SellModal from "./components/SellModal";
import SellerProfilePanel from "./components/SellerProfilePanel";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  ProductCategory,
  useAllProducts,
  useCreateProduct,
} from "./hooks/useQueries";
import type { Product } from "./hooks/useQueries";

const SAMPLE_PRODUCTS = [
  {
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise cancelling wireless headphones with 30hr battery life.",
    price: 29900n,
    category: ProductCategory.electronics,
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
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
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    sellerId: "Grace H.",
  },
  {
    title: "Vintage Leather Jacket",
    description:
      "Genuine brown leather motorcycle jacket, size M. 90s classic, barely worn.",
    price: 18500n,
    category: ProductCategory.fashion,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    sellerId: "Henry P.",
  },
  {
    title: "Dyson V15 Detect Vacuum",
    description:
      "Cordless vacuum with laser dust detection and HEPA filtration. 60-min runtime.",
    price: 64900n,
    category: ProductCategory.home,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    sellerId: "Iris W.",
  },
  {
    title: "Wilson Pro Tennis Racket",
    description:
      "Carbon fiber frame, 100sq in head. Used one season, excellent condition.",
    price: 18900n,
    category: ProductCategory.sports,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    sellerId: "Jack M.",
  },
];

export default function App() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const { data: products = [], isLoading: productsLoading } = useAllProducts();
  const createProduct = useCreateProduct();

  const [seeded, setSeeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [reviewsPanelProduct, setReviewsPanelProduct] =
    useState<Product | null>(null);
  const [sellerProfilePrincipal, setSellerProfilePrincipal] =
    useState<Principal | null>(null);
  const [displayCount, setDisplayCount] = useState(8);

  const prevIdentityRef = useRef<typeof identity>(undefined);
  useEffect(() => {
    const wasLoggedOut = !prevIdentityRef.current;
    const isNowLoggedIn = !!identity;
    prevIdentityRef.current = identity;

    if (wasLoggedOut && isNowLoggedIn && actor) {
      const principal = identity!.getPrincipal();
      actor.assignCallerUserRole(principal, UserRole.user).catch(() => {
        // role may already be assigned
      });
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

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMyListingsClick={() => setShowMyListings(true)}
      />
      <NavBar onSellClick={handleSellClick} />

      {showMyListings ? (
        <main>
          <MyListings onBack={() => setShowMyListings(false)} />
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
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            <div id="products">
              <ProductGrid
                products={displayedProducts}
                isLoading={productsLoading}
                hasMore={displayCount < filteredProducts.length}
                onLoadMore={() => setDisplayCount((c) => c + 8)}
                onBuyNow={(product) => setChatProduct(product)}
                onViewReviews={(product) => setReviewsPanelProduct(product)}
                onViewSeller={(seller) => setSellerProfilePrincipal(seller)}
              />
            </div>
            <BottomContent />
          </div>
        </main>
      )}

      <Footer />

      <SellModal open={showSellModal} onClose={() => setShowSellModal(false)} />

      {chatProduct && (
        <ProductChatModal
          product={chatProduct}
          onClose={() => setChatProduct(null)}
          onLeaveReview={(product) => {
            setChatProduct(null);
            setReviewProduct(product);
          }}
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
      />

      <LiveSupportChat />
      <Toaster />
    </div>
  );
}
