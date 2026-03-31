import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSendSupportMessage, useSupportMessages } from "../hooks/useQueries";

interface LiveSupportChatProps {
  forceOpen?: boolean;
  onForceOpenHandled?: () => void;
}

export default function LiveSupportChat({
  forceOpen,
  onForceOpenHandled,
}: LiveSupportChatProps) {
  const [open, setOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { identity } = useInternetIdentity();

  const { data: messages = [], isLoading } = useSupportMessages();
  const sendMessage = useSendSupportMessage();

  // Handle forceOpen from parent
  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      onForceOpenHandled?.();
    }
  }, [forceOpen, onForceOpenHandled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is a stable mutable ref
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const handleSend = async () => {
    if (!message.trim() || !senderName.trim()) return;
    if (!identity) {
      toast.error("Please sign in to use support chat");
      return;
    }
    try {
      await sendMessage.mutateAsync({
        sender: senderName,
        text: message.trim(),
      });
      setMessage("");
    } catch {
      toast.error("Please sign in to use support chat");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(30,115,232,0.18)] border border-border flex flex-col overflow-hidden"
            data-ocid="support.panel"
          >
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-primary-foreground font-semibold text-sm">
                  Live Support
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground"
                data-ocid="support.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!nameSet ? (
              <div className="flex-1 flex flex-col items-center justify-center p-5 gap-3">
                <MessageCircle className="w-10 h-10 text-primary" />
                <p className="text-foreground font-medium text-center text-sm">
                  How can we help you today?
                </p>
                <Input
                  data-ocid="support.input"
                  placeholder="Your name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && senderName.trim() && setNameSet(true)
                  }
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => senderName.trim() && setNameSet(true)}
                  className="w-full bg-primary text-primary-foreground rounded-full text-sm"
                  data-ocid="support.primary_button"
                >
                  Start Chat
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="h-56 px-3 py-3">
                  {isLoading ? (
                    <div
                      className="flex justify-center pt-6"
                      data-ocid="support.loading_state"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div
                      className="text-center text-muted-foreground text-xs py-6"
                      data-ocid="support.empty_state"
                    >
                      Send a message to get started!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((msg, i) => {
                        const isMe = msg.sender === senderName;
                        return (
                          <div
                            key={`${msg.timestamp.toString()}-${i}`}
                            className={`flex gap-1.5 ${isMe ? "flex-row-reverse" : ""}`}
                            data-ocid={`support.item.${i + 1}`}
                          >
                            <Avatar className="w-6 h-6 shrink-0">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">
                                {msg.sender.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`max-w-[80%] px-2.5 py-1.5 rounded-xl text-xs ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-tr-none"
                                  : "bg-muted text-foreground rounded-tl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </ScrollArea>
                <div className="px-3 py-2 border-t border-border flex gap-2">
                  <Input
                    data-ocid="support.input"
                    placeholder="Type a message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="text-sm h-8"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={sendMessage.isPending || !message.trim()}
                    className="bg-primary text-primary-foreground h-8 w-8 shrink-0"
                    data-ocid="support.submit_button"
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_4px_16px_rgba(30,115,232,0.4)] hover:bg-primary/90 transition-colors"
        data-ocid="support.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
