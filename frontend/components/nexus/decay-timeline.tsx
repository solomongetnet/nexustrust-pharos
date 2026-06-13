import { useState, useRef, useCallback, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts";

export function DecayTimeline({ initialScore }: { initialScore: number }) {
  const [days, setDays] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const data = Array.from({ length: 91 }, (_, i) => ({
    day: i,
    score: Math.max(0, initialScore * Math.exp(-i / 180) - (i > 30 ? (i - 30) * 0.15 : 0)),
  }));
  const projected = data[days]?.score ?? initialScore;
  const decay = initialScore - projected;
  const progress = days / 90;

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      setDays(Math.round(pct * 90));
    },
    []
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleTrackClick(e as unknown as React.MouseEvent<HTMLDivElement>);
  }, [handleTrackClick]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      setDays(Math.round(pct * 90));
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  // Touch support
  useEffect(() => {
    if (!isDragging) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      setDays(Math.round(pct * 90));
    };
    const handleTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const tickLabels = [
    { day: 0, label: "NOW" },
    { day: 30, label: "30d" },
    { day: 60, label: "60d" },
    { day: 90, label: "90d" },
  ];

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-end justify-between">
        <div>
          <div className="mono text-3xl font-semibold tracking-tight text-foreground">
            {projected.toFixed(1)}
          </div>
          <div className="mono mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Projected score · day <span className="text-foreground">{days}</span>
          </div>
        </div>
        <div className="text-right">
          <div
            className="mono text-sm font-medium tabular-nums"
            style={{ color: decay > 15 ? "oklch(0.65 0.22 25)" : "oklch(0.78 0.16 75)" }}
          >
            −{decay.toFixed(1)}
          </div>
          <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">
            decay
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="decayFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
                <stop offset="60%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: "oklch(0.5 0.01 270)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="oklch(0.65 0.18 250)"
              strokeWidth={1.5}
              fill="url(#decayFill)"
            />
            <ReferenceLine
              x={days}
              stroke="oklch(0.65 0.18 250)"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Modern slider */}
      <div className="select-none">
        {/* Tick labels row */}
        <div className="relative mb-2 h-4">
          {tickLabels.map((t) => (
            <div
              key={t.day}
              className="absolute -translate-x-1/2 transform"
              style={{ left: `${(t.day / 90) * 100}%` }}
            >
              <span
                className={cn(
                  "mono text-[9px] uppercase tracking-widest transition-colors duration-200",
                  days >= t.day ? "text-foreground" : "text-muted-foreground/60"
                )}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* Custom track */}
        <div
          ref={trackRef}
          className="group relative h-6 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            setIsDragging(true);
            const touch = e.touches[0];
            if (trackRef.current) {
              const rect = trackRef.current.getBoundingClientRect();
              const x = touch.clientX - rect.left;
              const pct = Math.max(0, Math.min(1, x / rect.width));
              setDays(Math.round(pct * 90));
            }
          }}
        >
          {/* Track background */}
          <div className="absolute inset-y-0 left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-border">
            {/* Gradient fill */}
            <div
              className="h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, oklch(0.65 0.18 250) 0%, oklch(0.72 0.14 60) 60%, oklch(0.65 0.22 25) 100%)`,
              }}
            />
          </div>

          {/* Glow behind thumb */}
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-150 ease-out"
            style={{
              left: `calc(${progress * 100}% - ${8 + progress * 0}px)`,
              background: "oklch(0.65 0.18 250)",
              filter: "blur(8px)",
              opacity: isDragging ? 0.6 : 0.3,
            }}
          />

          {/* Thumb */}
          <div
            className="absolute top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-background bg-pharos-blue shadow-lg transition-all duration-150 ease-out active:cursor-grabbing active:scale-125 group-hover:scale-110"
            style={{
              left: `calc(${progress * 100}% - 8px)`,
              boxShadow: isDragging
                ? "0 0 0 4px oklch(0.65 0.18 250 / 0.25), 0 2px 8px oklch(0.65 0.18 250 / 0.4)"
                : "0 0 0 2px oklch(0.65 0.18 250 / 0.15), 0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {/* Inner dot */}
            <div className="h-1 w-1 rounded-full bg-background" />
          </div>

          {/* Tick marks on track */}
          {tickLabels.map((t) => (
            <div
              key={t.day}
              className="absolute top-1/2 h-2.5 w-px -translate-y-1/2"
              style={{
                left: `${(t.day / 90) * 100}%`,
                backgroundColor: days >= t.day ? "oklch(0.65 0.18 250 / 0.6)" : "oklch(0.5 0.01 270 / 0.3)",
              }}
            />
          ))}
        </div>

        {/* Day readout */}
        <div className="mt-2 flex items-center justify-between">
          <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Projection horizon
          </div>
          <div
            className={cn(
              "mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest transition-all duration-200",
              days > 60
                ? "border-pharos-red/30 bg-pharos-red/10 text-pharos-red"
                : days > 30
                  ? "border-pharos-amber/30 bg-pharos-amber/10 text-pharos-amber"
                  : "border-pharos-blue/30 bg-pharos-blue/10 text-pharos-blue"
            )}
          >
            <span className="inline-block h-1 w-1 rounded-full animate-pulse" />
            {days} days
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple cn helper to avoid extra import
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
