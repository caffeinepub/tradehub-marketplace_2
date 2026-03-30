import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  LayoutList,
  LogIn,
  LogOut,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onMyListingsClick: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onMyListingsClick,
}: HeaderProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();
  const shortId = principal ? principal.slice(0, 5) : "";

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight">
            TradeHub
          </span>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="header.search_input"
            className="pl-9 rounded-full bg-muted/60 border-border focus-visible:ring-primary"
            placeholder="Search products, categories…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            data-ocid="header.button"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" data-ocid="header.button">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          </Button>

          {identity ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                  data-ocid="header.open_modal_button"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {shortId.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {shortId}…
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={onMyListingsClick}
                  className="cursor-pointer"
                  data-ocid="header.link"
                >
                  <LayoutList className="w-4 h-4 mr-2" />
                  My Listings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={clear}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  data-ocid="header.link"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-full text-xs font-semibold"
              data-ocid="header.primary_button"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              {isLoggingIn ? "Signing in…" : "Sign In"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
