'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    // Force scroll to top on reload
    window.scrollTo(0, 0);

    // Make the loading bar go to 100% over the next ~1.8 seconds
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Start hiding the splash screen at 3 seconds
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    // Fully unmount the component from DOM 1 second after it starts fading out
    if (!show) {
      const unmountTimer = setTimeout(() => setUnmount(true), 1000);
      return () => clearTimeout(unmountTimer);
    }
  }, [show]);

  if (unmount) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-out",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className={cn(
        "flex flex-col items-center gap-8 transition-all duration-700 ease-out transform",
        show ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
      )}>
        <div className="flex items-center gap-4">
          <img 
            src="/favicon.svg" 
            alt="NexusTrust Logo" 
            className="size-16 animate-pulse" 
          />
          <span className="mono text-3xl font-bold tracking-tighter">NEXUSTRUST</span>
        </div>
        
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-border/50">
          <div 
            className="absolute inset-y-0 left-0 bg-foreground transition-all ease-in-out"
            style={{ 
              width: `${progress}%`,
              transitionDuration: "2800ms"
            }} 
          />
        </div>
      </div>
    </div>
  );
}
