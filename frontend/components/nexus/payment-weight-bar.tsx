export function PaymentWeightBar({ volume, max }: { volume: number; max: number }) {
  const pct = Math.min(100, (volume / max) * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="mono text-2xl font-medium tracking-tighter">
          {(volume / 1_000_000).toFixed(2)}M <span className="text-sm text-muted-foreground">PROS</span>
        </span>
        <span className="mono text-[10px] text-muted-foreground">{pct.toFixed(1)}% of tier max</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-pharos-green transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Sourced from x402 settlement receipts on Pharos-L1. Higher volume increases priority routing weight.
      </p>
    </div>
  );
}
