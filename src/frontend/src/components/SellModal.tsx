import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProductCategory, useCreateProduct } from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

const CATEGORIES = [
  { label: "Electronics", value: ProductCategory.electronics },
  { label: "Fashion", value: ProductCategory.fashion },
  { label: "Home", value: ProductCategory.home },
  { label: "Sports", value: ProductCategory.sports },
  { label: "Hobbies", value: ProductCategory.hobbies },
  { label: "Autos", value: ProductCategory.autos },
];

interface SellModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SellModal({ open, onClose }: SellModalProps) {
  const createProduct = useCreateProduct();
  const storageClient = useStorageClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const update = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.category) {
      toast.error("Please fill in required fields");
      return;
    }
    const priceInCents = Math.round(Number(form.price) * 100);
    if (Number.isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    let resolvedImageUrl =
      "https://placehold.co/400x400/EEF5FB/1E73E8?text=No+Image";

    if (imageFile && storageClient) {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
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

    await createProduct.mutateAsync({
      title: form.title,
      description: form.description,
      price: BigInt(priceInCents),
      category: form.category as ProductCategory,
      imageUrl: resolvedImageUrl,
      sellerId: "",
    });
    toast.success("Your listing is live!");
    setForm({ title: "", description: "", price: "", category: "" });
    clearImage();
    onClose();
  };

  const isPending = isUploading || createProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="sell.modal">
        <DialogHeader>
          <DialogTitle>Create a New Listing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              data-ocid="sell.input"
              placeholder="e.g. iPhone 14 Pro"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-ocid="sell.textarea"
              placeholder="Describe your item…"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                data-ocid="sell.input"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1" data-ocid="sell.select">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Product Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="sell-image-input"
              data-ocid="sell.upload_button"
            />
            {imagePreview ? (
              <div className="relative mt-1 rounded-lg overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 px-6">
                    <p className="text-white text-sm font-medium">
                      Uploading… {uploadProgress}%
                    </p>
                    <Progress value={uploadProgress} className="w-full h-2" />
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="sell-image-input"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="mt-1 flex flex-col items-center justify-center gap-2 h-36 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-colors"
                data-ocid="sell.dropzone"
              >
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Click or drag &amp; drop an image
                </p>
              </label>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground rounded-full"
            data-ocid="sell.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isUploading ? `Uploading… ${uploadProgress}%` : "Publishing…"}
              </>
            ) : (
              "Publish Listing"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
