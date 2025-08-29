
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, CornerDownLeft, Loader } from "lucide-react";
import { askCopilot } from "@/ai/flows/copilot-flow";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "copilot";
  content: string;
};

export function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askCopilot(input);
      const copilotMessage: Message = { role: "copilot", content: response };
      setMessages((prev) => [...prev, copilotMessage]);
    } catch (error) {
      console.error("Copilot error:", error);
      const errorMessage: Message = {
        role: "copilot",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);
  

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-4 z-50 w-[400px] h-[600px] bg-card/80 backdrop-blur-xl border border-primary/50 rounded-lg shadow-2xl shadow-primary/20 flex flex-col"
          >
            <header className="p-4 border-b border-primary/30 text-primary font-bold text-lg text-center">
              Quantum Copilot
            </header>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                    {message.role === "copilot" && (
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Bot className="text-primary size-5" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        message.role === "user" ? "bg-primary/80 text-primary-foreground" : "bg-secondary"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === "user" && (
                       <div className="p-2 bg-muted rounded-full">
                        <User className="text-foreground size-5" />
                       </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3 justify-start">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Bot className="text-primary size-5" />
                      </div>
                       <div className="p-3 rounded-lg bg-secondary flex items-center justify-center">
                          <Loader className="animate-spin text-primary size-5" />
                       </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="p-4 border-t border-primary/30">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about jobs, backends, ETAs..."
                  className="pr-12 bg-background/50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-primary/20"
                  disabled={isLoading}
                >
                  <CornerDownLeft className="size-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-16 h-16 bg-primary/80 text-primary-foreground shadow-lg shadow-primary/40 backdrop-blur-sm border-2 border-primary"
        >
          <Bot size={28} />
        </Button>
      </motion.div>
    </>
  );
}
