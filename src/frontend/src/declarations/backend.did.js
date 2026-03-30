/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const _CaffeineStorageCreateCertificateResult = IDL.Record({
  'method' : IDL.Text,
  'blob_hash' : IDL.Text,
});
export const _CaffeineStorageRefillInformation = IDL.Record({
  'proposed_top_up_amount' : IDL.Opt(IDL.Nat),
});
export const _CaffeineStorageRefillResult = IDL.Record({
  'success' : IDL.Opt(IDL.Bool),
  'topped_up_amount' : IDL.Opt(IDL.Nat),
});
export const UserRole = IDL.Variant({
  'admin' : IDL.Null,
  'user' : IDL.Null,
  'guest' : IDL.Null,
});
export const ProductCategory = IDL.Variant({
  'autos' : IDL.Null,
  'home' : IDL.Null,
  'sports' : IDL.Null,
  'fashion' : IDL.Null,
  'electronics' : IDL.Null,
  'hobbies' : IDL.Null,
});
export const Time = IDL.Int;
export const Product = IDL.Record({
  'id' : IDL.Nat,
  'title' : IDL.Text,
  'createdAt' : Time,
  'description' : IDL.Text,
  'isSold' : IDL.Bool,
  'seller' : IDL.Principal,
  'imageUrl' : IDL.Text,
  'category' : ProductCategory,
  'price' : IDL.Nat,
});
export const UserProfile = IDL.Record({ 'name' : IDL.Text });
export const MarketPlaceMessage = IDL.Record({
  'text' : IDL.Text,
  'productId' : IDL.Nat,
  'sender' : IDL.Text,
  'timestamp' : Time,
});
export const SupportMessage = IDL.Record({
  'text' : IDL.Text,
  'sender' : IDL.Text,
  'timestamp' : Time,
});
export const Review = IDL.Record({
  'productId' : IDL.Nat,
  'reviewer' : IDL.Principal,
  'rating' : IDL.Nat,
  'comment' : IDL.Text,
  'timestamp' : Time,
});

export const idlService = IDL.Service({
  '_caffeineStorageBlobIsLive' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], ['query']),
  '_caffeineStorageBlobsToDelete' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
  '_caffeineStorageConfirmBlobDeletion' : IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
  '_caffeineStorageCreateCertificate' : IDL.Func([IDL.Text], [_CaffeineStorageCreateCertificateResult], []),
  '_caffeineStorageRefillCashier' : IDL.Func([IDL.Opt(_CaffeineStorageRefillInformation)], [_CaffeineStorageRefillResult], []),
  '_caffeineStorageUpdateGatewayPrincipals' : IDL.Func([], [], []),
  '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
  'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
  'createProduct' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat, ProductCategory, IDL.Text, IDL.Text], [IDL.Nat], []),
  'updateProduct' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, ProductCategory, IDL.Text], [], []),
  'deleteProduct' : IDL.Func([IDL.Nat], [], []),
  'getAllProductsSorted' : IDL.Func([], [IDL.Vec(Product)], ['query']),
  'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
  'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
  'getMarketPlaceMessagesByProduct' : IDL.Func([IDL.Nat], [IDL.Vec(MarketPlaceMessage)], ['query']),
  'getMyProducts' : IDL.Func([], [IDL.Vec(Product)], ['query']),
  'getProduct' : IDL.Func([IDL.Nat], [Product], ['query']),
  'getProductCategories' : IDL.Func([], [IDL.Vec(ProductCategory)], ['query']),
  'getProductsByCategory' : IDL.Func([ProductCategory], [IDL.Vec(Product)], ['query']),
  'getSupportMessages' : IDL.Func([], [IDL.Vec(SupportMessage)], ['query']),
  'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
  'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
  'markProductAsSold' : IDL.Func([IDL.Nat], [], []),
  'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
  'sendMarketPlaceMessage' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], []),
  'sendSupportMessage' : IDL.Func([IDL.Text, IDL.Text], [], []),
  'addReview' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [], []),
  'getReviewsByProduct' : IDL.Func([IDL.Nat], [IDL.Vec(Review)], ['query']),
  'setSellerVerified' : IDL.Func([IDL.Principal, IDL.Bool], [], []),
  'getManuallyVerifiedSellers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const _CaffeineStorageCreateCertificateResult = IDL.Record({ 'method' : IDL.Text, 'blob_hash' : IDL.Text });
  const _CaffeineStorageRefillInformation = IDL.Record({ 'proposed_top_up_amount' : IDL.Opt(IDL.Nat) });
  const _CaffeineStorageRefillResult = IDL.Record({ 'success' : IDL.Opt(IDL.Bool), 'topped_up_amount' : IDL.Opt(IDL.Nat) });
  const UserRole = IDL.Variant({ 'admin' : IDL.Null, 'user' : IDL.Null, 'guest' : IDL.Null });
  const ProductCategory = IDL.Variant({ 'autos' : IDL.Null, 'home' : IDL.Null, 'sports' : IDL.Null, 'fashion' : IDL.Null, 'electronics' : IDL.Null, 'hobbies' : IDL.Null });
  const Time = IDL.Int;
  const Product = IDL.Record({ 'id' : IDL.Nat, 'title' : IDL.Text, 'createdAt' : Time, 'description' : IDL.Text, 'isSold' : IDL.Bool, 'seller' : IDL.Principal, 'imageUrl' : IDL.Text, 'category' : ProductCategory, 'price' : IDL.Nat });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const MarketPlaceMessage = IDL.Record({ 'text' : IDL.Text, 'productId' : IDL.Nat, 'sender' : IDL.Text, 'timestamp' : Time });
  const SupportMessage = IDL.Record({ 'text' : IDL.Text, 'sender' : IDL.Text, 'timestamp' : Time });
  const Review = IDL.Record({ 'productId' : IDL.Nat, 'reviewer' : IDL.Principal, 'rating' : IDL.Nat, 'comment' : IDL.Text, 'timestamp' : Time });
  
  return IDL.Service({
    '_caffeineStorageBlobIsLive' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], ['query']),
    '_caffeineStorageBlobsToDelete' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
    '_caffeineStorageConfirmBlobDeletion' : IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
    '_caffeineStorageCreateCertificate' : IDL.Func([IDL.Text], [_CaffeineStorageCreateCertificateResult], []),
    '_caffeineStorageRefillCashier' : IDL.Func([IDL.Opt(_CaffeineStorageRefillInformation)], [_CaffeineStorageRefillResult], []),
    '_caffeineStorageUpdateGatewayPrincipals' : IDL.Func([], [], []),
    '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'createProduct' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat, ProductCategory, IDL.Text, IDL.Text], [IDL.Nat], []),
    'updateProduct' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, ProductCategory, IDL.Text], [], []),
    'deleteProduct' : IDL.Func([IDL.Nat], [], []),
    'getAllProductsSorted' : IDL.Func([], [IDL.Vec(Product)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getMarketPlaceMessagesByProduct' : IDL.Func([IDL.Nat], [IDL.Vec(MarketPlaceMessage)], ['query']),
    'getMyProducts' : IDL.Func([], [IDL.Vec(Product)], ['query']),
    'getProduct' : IDL.Func([IDL.Nat], [Product], ['query']),
    'getProductCategories' : IDL.Func([], [IDL.Vec(ProductCategory)], ['query']),
    'getProductsByCategory' : IDL.Func([ProductCategory], [IDL.Vec(Product)], ['query']),
    'getSupportMessages' : IDL.Func([], [IDL.Vec(SupportMessage)], ['query']),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'markProductAsSold' : IDL.Func([IDL.Nat], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'sendMarketPlaceMessage' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], []),
    'sendSupportMessage' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addReview' : IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [], []),
    'getReviewsByProduct' : IDL.Func([IDL.Nat], [IDL.Vec(Review)], ['query']),
    'setSellerVerified' : IDL.Func([IDL.Principal, IDL.Bool], [], []),
    'getManuallyVerifiedSellers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
