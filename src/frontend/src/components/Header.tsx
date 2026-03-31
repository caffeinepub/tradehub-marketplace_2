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
  Copy,
  LayoutList,
  LogIn,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Product } from "../hooks/useQueries";
import CartSheet from "./CartSheet";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onMyListingsClick: () => void;
  onMessagesClick?: () => void;
  hasMessages?: boolean;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  cartItems?: Product[];
  onRemoveFromCart?: (id: bigint) => void;
  onClearCart?: () => void;
  onBuyNow?: (product: Product) => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onMyListingsClick,
  onMessagesClick,
  hasMessages = false,
  isAdmin,
  onAdminClick,
  cartItems = [],
  onRemoveFromCart,
  onClearCart,
  onBuyNow,
}: HeaderProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();
  const shortId = principal ? principal.slice(0, 5) : "";

  const handleSignUp = () => {
    sessionStorage.setItem("tradehub_signup_intent", "true");
    login();
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center gap-2 sm:gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 shrink-0 select-none min-w-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/tradehub-logo-transparent.dim_200x200.png"
            alt="TradeHub logo"
            className="w-14 h-14 sm:w-20 sm:h-20 object-contain flex-shrink-0"
          />
          <span className="font-bold text-xl sm:text-3xl text-foreground tracking-tight leading-none whitespace-nowrap">
            TradeHub
          </span>
        </div>

        {/* Search — hidden on very small screens */}
        <div className="hidden sm:flex flex-1 min-w-0 max-w-2xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="header.search_input"
            className="w-full pl-10 h-11 rounded-full bg-muted/60 border border-border hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-colors text-sm"
            placeholder="Search products, categories…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          {/* Search icon on very small screens */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden relative rounded-full hover:bg-secondary"
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>(
                "[data-ocid='mobile-search-input']",
              );
              el?.focus();
            }}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-secondary"
            onClick={onMessagesClick}
            data-ocid="header.button"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {hasMessages && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            )}
          </Button>

          <CartSheet
            cartItems={cartItems}
            onRemoveFromCart={onRemoveFromCart ?? (() => {})}
            onClearCart={onClearCart ?? (() => {})}
            onBuyNow={onBuyNow ?? (() => {})}
          />

          {identity ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer focus:outline-none ml-1"
                  data-ocid="header.open_modal_button"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-primary/40 transition-all">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {shortId.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {hasMessages && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {shortId}…
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={onMyListingsClick}
                  className="cursor-pointer"
                  data-ocid="header.link"
                >
                  <LayoutList className="w-4 h-4 mr-2" />
                  My Listings
                </DropdownMenuItem>
                {onMessagesClick && (
                  <DropdownMenuItem
                    onClick={onMessagesClick}
                    className="cursor-pointer"
                    data-ocid="header.link"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="flex-1">Messages</span>
                    {hasMessages && (
                      <span className="w-2 h-2 rounded-full bg-red-500 ml-1" />
                    )}
                  </DropdownMenuItem>
                )}
                {isAdmin && onAdminClick && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onAdminClick}
                      className="cursor-pointer text-blue-600 focus:text-blue-600"
                      data-ocid="header.link"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(principal ?? "");
                    toast.success("Principal ID copied!");
                  }}
                  className="cursor-pointer"
                  data-ocid="header.button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy My Principal ID
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
            <div className="flex items-center gap-2 ml-1">
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="rounded-full text-xs font-semibold whitespace-nowrap hidden sm:flex"
                data-ocid="header.secondary_button"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </Button>
              <Button
                size="sm"
                onClick={handleSignUp}
                disabled={isLoggingIn}
                className="rounded-full text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                data-ocid="header.primary_button"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
