import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface RegisterModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export default function RegisterModal({
  open,
  onComplete,
}: RegisterModalProps) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: trimmed });
      toast.success(`Welcome to TradeHub, ${trimmed}!`);
      onComplete(trimmed);
    } catch {
      toast.error("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden"
        data-ocid="register.modal"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        <div className="px-8 pt-6 pb-8">
          <DialogHeader className="items-center text-center gap-3 mb-6">
            <img
              src="/assets/generated/tradehub-logo-transparent.dim_200x200.png"
              alt="TradeHub"
              className="w-16 h-16 object-contain"
            />
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Welcome to TradeHub
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                You're just one step away — pick a display name to get started.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-sm font-medium">
                Display Name
              </Label>
              <Input
                id="display-name"
                data-ocid="register.input"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                maxLength={48}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
              disabled={!name.trim() || saving}
              data-ocid="register.submit_button"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {saving ? "Creating profile…" : "Create my account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Your account is secured by Internet Identity — no passwords needed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
