import { Button } from "@/components/ui/button";
import { ChevronDown, Tag } from "lucide-react";

interface NavBarProps {
  onSellClick: () => void;
  onExploreClick?: () => void;
  onTrendingClick?: () => void;
  onDealsClick?: () => void;
  onHelpClick?: () => void;
  activeSortMode?: "trending" | "deals" | null;
}

export default function NavBar({
  onSellClick,
  onExploreClick,
  onTrendingClick,
  onDealsClick,
  onHelpClick,
  activeSortMode,
}: NavBarProps) {
  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onExploreClick}
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Explore Categories <ChevronDown className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onTrendingClick}
            className={`text-sm transition-colors font-medium ${
              activeSortMode === "trending"
                ? "text-primary underline underline-offset-4"
                : "text-muted-foreground hover:text-primary"
            }`}
            data-ocid="nav.tab"
          >
            Trending
          </button>
          <button
            type="button"
            onClick={onDealsClick}
            className={`text-sm transition-colors font-medium ${
              activeSortMode === "deals"
                ? "text-primary underline underline-offset-4"
                : "text-muted-foreground hover:text-primary"
            }`}
            data-ocid="nav.tab"
          >
            Deals
          </button>
          <button
            type="button"
            onClick={onHelpClick}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Help Center
          </button>
        </div>
        <Button
          size="sm"
          onClick={onSellClick}
          className="bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 rounded-full text-xs px-5 font-semibold shadow-card transition-opacity"
          data-ocid="nav.primary_button"
        >
          <Tag className="w-3 h-3 mr-1" />
          Sell Your Item
        </Button>
      </div>
    </nav>
  );
}
