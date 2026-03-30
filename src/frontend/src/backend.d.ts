import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    title: string;
    createdAt: Time;
    description: string;
    isSold: boolean;
    seller: Principal;
    imageUrl: string;
    category: ProductCategory;
    price: bigint;
}
export type Time = bigint;
export interface MarketPlaceMessage {
    text: string;
    productId: bigint;
    sender: string;
    timestamp: Time;
}
export interface SupportMessage {
    text: string;
    sender: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    productId: bigint;
    reviewer: Principal;
    rating: bigint;
    comment: string;
    timestamp: Time;
}
export enum ProductCategory {
    autos = "autos",
    home = "home",
    sports = "sports",
    fashion = "fashion",
    electronics = "electronics",
    hobbies = "hobbies"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(title: string, description: string, price: bigint, category: ProductCategory, imageUrl: string, sellerId: string): Promise<bigint>;
    updateProduct(id: bigint, title: string, description: string, price: bigint, category: ProductCategory, imageUrl: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProductsSorted(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMarketPlaceMessagesByProduct(productId: bigint): Promise<Array<MarketPlaceMessage>>;
    getMyProducts(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getProductCategories(): Promise<Array<ProductCategory>>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getSupportMessages(): Promise<Array<SupportMessage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markProductAsSold(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMarketPlaceMessage(productId: bigint, sender: string, text: string): Promise<void>;
    sendSupportMessage(sender: string, text: string): Promise<void>;
    addReview(productId: bigint, rating: bigint, comment: string): Promise<void>;
    getReviewsByProduct(productId: bigint): Promise<Array<Review>>;
}
