import { useAccount } from "wagmi";
import { Lock, ShieldCheck, Zap, KeyRound } from "lucide-react";
import { ConnectWalletButton } from "@/components/nexus/connect-wallet-button";

interface WalletGateProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Renders children only when a wallet is connected.
 * Otherwise shows a consistent, mono/terminal-style "connect required" panel.
 */
export function WalletGate({
  title = "Wallet connection required",
  description = "This area is reserved for authenticated agent operators. Connect your wallet to view and manage your on-chain agents.",
  children,
}: WalletGateProps) {
  const { isConnected } = useAccount();

  if (isConnected) return <>{children}</>;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-border bg-background px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              /// Access Control
            </span>
          </div>
          <span className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-pharos-amber">
            <span className="size-1.5 rounded-full bg-pharos-amber pulse-node" />
            Locked
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-8 text-center sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-lg border border-border bg-background">
            <Lock className="size-6 text-pharos-blue" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-6 flex justify-center">
            <ConnectWalletButton />
          </div>

          {/* Trust trio */}
          <div className="mt-8 grid grid-cols-1 gap-2 border-t border-border pt-6 sm:grid-cols-3">
            <TrustBullet
              icon={<ShieldCheck className="size-3.5 text-pharos-green" />}
              label="Non-custodial"
              sub="Keys never leave device"
            />
            <TrustBullet
              icon={<KeyRound className="size-3.5 text-pharos-blue" />}
              label="Local signing"
              sub="Auth via wallet signature"
            />
            <TrustBullet
              icon={<Zap className="size-3.5 text-pharos-amber" />}
              label="Pharos Testnet"
              sub="Chain 688688"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBullet({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-2 sm:items-start sm:text-left">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="mono text-[10px] font-semibold uppercase tracking-widest text-foreground">
          {label}
        </span>
      </div>
      <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {sub}
      </span>
    </div>
  );
}
