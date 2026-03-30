import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCategory, useCreateProduct } from "../hooks/useQueries";

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
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const update = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

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
    await createProduct.mutateAsync({
      title: form.title,
      description: form.description,
      price: BigInt(priceInCents),
      category: form.category as ProductCategory,
      imageUrl:
        form.imageUrl ||
        "https://placehold.co/400x400/EEF5FB/1E73E8?text=No+Image",
      sellerId: "",
    });
    toast.success("Your listing is live!");
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
    onClose();
  };

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
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              data-ocid="sell.input"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={createProduct.isPending}
            className="w-full bg-primary text-primary-foreground rounded-full"
            data-ocid="sell.submit_button"
          >
            {createProduct.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing…
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
