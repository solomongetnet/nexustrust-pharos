"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: "full" | "compact";
  className?: string;
}

export const ErrorDisplay = ({
  title = "Connection Interrupted",
  message = "We've lost the signal to the archive. Please check your frequency and try again.",
  onRetry,
  variant = "full",
  className,
}: ErrorDisplayProps) => {
  const isFull = variant === "full";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isFull ? "min-h-[60vh] p-8" : "p-6 rounded-2xl bg-red-500/5 border border-red-500/10",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/5 text-red-500 mb-6",
          isFull ? "w-20 h-20" : "w-12 h-12"
        )}
      >
        <WifiOff className={isFull ? "w-8 h-8" : "w-5 h-5"} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-red-500/20"
        />
      </motion.div>

      <div className="space-y-2 max-w-sm">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            "font-medium tracking-tight text-white",
            isFull ? "text-2xl md:text-3xl" : "text-lg"
          )}
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "text-muted-foreground font-light leading-relaxed",
            isFull ? "text-base" : "text-xs"
          )}
        >
          {message}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-4 mt-8"
      >
        {onRetry && (
          <button
            onClick={onRetry}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            Reconnect
          </button>
        )}
        {isFull && (
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:text-white hover:border-white/20"
          >
            <Home className="w-3 h-3" />
            Home
          </button>
        )}
      </motion.div>

      {/* Cinematic Grid Detail */}
      {isFull && (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>
      )}
    </div>
  );
};
