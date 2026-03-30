import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PackageOpen,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../hooks/useQueries";
import {
  type ProductCategory,
  useDeleteProduct,
  useMarkAsSold,
  useMyProducts,
  useUpdateProduct,
} from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  home: "Home",
  sports: "Sports",
  hobbies: "Hobbies",
  autos: "Autos",
};

const CATEGORY_VALUES = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home" },
  { value: "sports", label: "Sports" },
  { value: "hobbies", label: "Hobbies" },
  { value: "autos", label: "Autos" },
];

function formatPrice(cents: bigint) {
  return `$${(Number(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function getCategoryKey(cat: ProductCategory): string {
  if (typeof cat === "string") return cat;
  const key = Object.keys(cat as object)[0];
  return key ?? "electronics";
}

interface EditDialogProps {
  product: Product;
  idx: number;
}

function EditDialog({ product, idx }: EditDialogProps) {
  const updateProduct = useUpdateProduct();
  const storageClient = useStorageClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [priceStr, setPriceStr] = useState(
    (Number(product.price) / 100).toFixed(2),
  );
  const [category, setCategory] = useState<string>(
    getCategoryKey(product.category),
  );
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setTitle(product.title);
      setDescription(product.description);
      setPriceStr((Number(product.price) / 100).toFixed(2));
      setCategory(getCategoryKey(product.category));
      setNewImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setUploadProgress(0);
    }
    setOpen(isOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setNewImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearNewImage = () => {
    setNewImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    const priceCents = BigInt(Math.round(Number.parseFloat(priceStr) * 100));
    const cat = { [category]: null } as unknown as ProductCategory;
    let resolvedImageUrl = product.imageUrl;

    if (newImageFile && storageClient) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const bytes = new Uint8Array(await newImageFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) =>
          setUploadProgress(pct),
        );
        resolvedImageUrl = await storageClient.getDirectURL(hash);
      } catch {
        toast.error("Image upload failed");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        title: title.trim(),
        description: description.trim(),
        price: priceCents,
        category: cat,
        imageUrl: resolvedImageUrl,
      });
      toast.success("Listing updated!");
      setOpen(false);
    } catch {
      toast.error("Failed to update listing");
    }
  };

  const isPending = isUploading || updateProduct.isPending;
  const displayPreview = imagePreview ?? product.imageUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-primary/40 text-primary hover:bg-primary/10"
          data-ocid={`mylistings.edit_button.${idx + 1}`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]" data-ocid="mylistings.dialog">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="mylistings.input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-ocid="mylistings.textarea"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-price">Price (USD)</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              step="0.01"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              data-ocid="mylistings.input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-ocid="mylistings.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_VALUES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Product Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="edit-image-input"
              data-ocid="mylistings.upload_button"
            />
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={displayPreview}
                alt="Product preview"
                className="w-full h-40 object-cover"
              />
              {newImageFile && (
                <button
                  type="button"
                  onClick={clearNewImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 px-6">
                  <p className="text-white text-sm font-medium">
                    Uploading… {uploadProgress}%
                  </p>
                  <Progress value={uploadProgress} className="w-full h-2" />
                </div>
              )}
              <label
                htmlFor="edit-image-input"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="absolute bottom-0 left-0 right-0 bg-black/40 hover:bg-black/60 transition-colors flex items-center justify-center gap-2 py-2 cursor-pointer"
                data-ocid="mylistings.dropzone"
              >
                <ImagePlus className="w-4 h-4 text-white" />
                <span className="text-white text-xs">Replace image</span>
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-ocid="mylistings.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !title.trim()}
            data-ocid="mylistings.save_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isUploading
              ? `Uploading… ${uploadProgress}%`
              : updateProduct.isPending
                ? "Saving..."
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MyListingsProps {
  onBack: () => void;
}

export default function MyListings({ onBack }: MyListingsProps) {
  const { data: products = [], isLoading } = useMyProducts();
  const markAsSold = useMarkAsSold();
  const deleteProduct = useDeleteProduct();

  const handleMarkSold = async (id: bigint) => {
    try {
      await markAsSold.mutateAsync(id);
      toast.success("Listing marked as sold!");
    } catch {
      toast.error("Failed to mark as sold");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2"
          data-ocid="mylistings.secondary_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your active and sold listings
          </p>
        </div>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          data-ocid="mylistings.loading_state"
        >
          {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map((key) => (
            <div
              key={key}
              className="rounded-xl border border-border overflow-hidden"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="mylistings.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            You have no listings yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Start selling! Click “Sell Your Item” to create your first listing.
          </p>
          <Button
            onClick={onBack}
            className="rounded-full"
            data-ocid="mylistings.primary_button"
          >
            Browse Marketplace
          </Button>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, idx) => (
            <div
              key={product.id.toString()}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
              data-ocid={`mylistings.item.${idx + 1}`}
            >
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                {product.isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Sold
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1">
                    {product.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {CATEGORY_LABELS[getCategoryKey(product.category)] ??
                      getCategoryKey(product.category)}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-2 mt-auto pt-2">
                  {!product.isSold ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-green-500 text-green-600 hover:bg-green-50"
                      onClick={() => handleMarkSold(product.id)}
                      disabled={markAsSold.isPending}
                      data-ocid={`mylistings.secondary_button.${idx + 1}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Sold
                    </Button>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <EditDialog product={product} idx={idx} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-destructive text-destructive hover:bg-destructive/10"
                        data-ocid={`mylistings.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="mylistings.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove "{product.title}" from
                          the marketplace. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="mylistings.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="mylistings.confirm_button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
