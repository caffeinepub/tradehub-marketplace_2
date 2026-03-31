import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductCategory } from "../backend.d";
import type {
  MarketPlaceMessage,
  Product,
  Review,
  SupportMessage,
  backendInterface,
} from "../backend.d";
import { useActor } from "./useActor";

export type { Product, MarketPlaceMessage, SupportMessage, Review };
export { ProductCategory };

function fullActor(actor: unknown): backendInterface {
  return actor as backendInterface;
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductsSorted();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5000,
  });
}

export function useProductsByCategory(category: ProductCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return fullActor(actor).getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 5000,
  });
}

export function useMyProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["myProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return fullActor(actor).getMyProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductMessages(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MarketPlaceMessage[]>({
    queryKey: ["messages", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getMarketPlaceMessagesByProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
    refetchInterval: 2000,
    staleTime: 0,
  });
}

export function useSupportMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<SupportMessage[]>({
    queryKey: ["support"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSupportMessages().catch(() => []);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useReviews(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return fullActor(actor).getReviewsByProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
    refetchInterval: 5000,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: bigint;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await fullActor(actor).addReview(productId, rating, comment);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", productId.toString()],
      });
    },
  });
}

export function useSendMarketplaceMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      sender,
      text,
    }: {
      productId: bigint;
      sender: string;
      text: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.sendMarketPlaceMessage(productId, sender, text);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", productId.toString()],
      });
    },
  });
}

export function useSendSupportMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sender, text }: { sender: string; text: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.sendSupportMessage(sender, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support"] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      price: bigint;
      category: ProductCategory;
      imageUrl: string;
      sellerId: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createProduct(
        params.title,
        params.description,
        params.price,
        params.category,
        params.imageUrl,
        params.sellerId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useMarkAsSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.markProductAsSold(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return fullActor(actor).deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      description: string;
      price: bigint;
      category: ProductCategory;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return fullActor(actor).updateProduct(
        params.id,
        params.title,
        params.description,
        params.price,
        params.category,
        params.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useAllProductReviews(productIds: bigint[]) {
  const { actor, isFetching } = useActor();
  const key = productIds.map((id) => id.toString()).join(",");
  return useQuery<Map<string, Review[]>>({
    queryKey: ["allReviews", key],
    queryFn: async () => {
      if (!actor || productIds.length === 0) return new Map();
      const results = await Promise.all(
        productIds.map((id) => fullActor(actor).getReviewsByProduct(id)),
      );
      const map = new Map<string, Review[]>();
      for (let i = 0; i < productIds.length; i++) {
        map.set(productIds[i].toString(), results[i]);
      }
      return map;
    },
    enabled: !!actor && !isFetching && productIds.length > 0,
    staleTime: 5000,
  });
}

export function useMyMessageCount() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["myMessageCount"],
    queryFn: async () => {
      if (!actor) return 0;
      const products = await fullActor(actor).getMyProducts();
      if (products.length === 0) return 0;
      const allMessages = await Promise.all(
        products.map((p) =>
          actor.getMarketPlaceMessagesByProduct(p.id).catch(() => []),
        ),
      );
      return allMessages.reduce((sum, msgs) => sum + msgs.length, 0);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    staleTime: 0,
  });
}
