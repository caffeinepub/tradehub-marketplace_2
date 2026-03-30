import { Button } from "@/components/ui/button";
import { ChevronDown, Tag } from "lucide-react";

interface NavBarProps {
  onSellClick: () => void;
}

export default function NavBar({ onSellClick }: NavBarProps) {
  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Explore Categories <ChevronDown className="w-3 h-3" />
          </button>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Trending
          </button>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Deals
          </button>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Help Center
          </button>
        </div>
        <Button
          size="sm"
          onClick={onSellClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs px-4 font-semibold"
          data-ocid="nav.primary_button"
        >
          <Tag className="w-3 h-3 mr-1" />
          Sell Your Item
        </Button>
      </div>
    </nav>
  );
}
