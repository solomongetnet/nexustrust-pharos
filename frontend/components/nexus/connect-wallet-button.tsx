import { useMemo, useState } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import {
  ChevronDown,
  Wallet,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { pharosTestnet } from "@/lib/wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function truncate(addr?: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

type WalletMeta = {
  id: string;
  name: string;
  tagline: string;
  badge?: "Popular" | "Recommended" | "Mobile" | "Hardware";
  initial: string;
  installUrl?: string;
};

const WALLET_META: Record<string, WalletMeta> = {
  metaMaskSDK: {
    id: "metaMaskSDK",
    name: "MetaMask",
    tagline: "Browser extension & mobile",
    badge: "Popular",
    initial: "M",
    installUrl: "https://metamask.io/download",
  },
  metaMask: {
    id: "metaMask",
    name: "MetaMask",
    tagline: "Browser extension & mobile",
    badge: "Popular",
    initial: "M",
    installUrl: "https://metamask.io/download",
  },
  injected: {
    id: "injected",
    name: "Browser Wallet",
    tagline: "Any injected EIP-1193 provider",
    initial: "B",
  },
  walletConnect: {
    id: "walletConnect",
    name: "WalletConnect",
    tagline: "Scan with 300+ mobile wallets",
    badge: "Mobile",
    initial: "W",
  },
  coinbaseWalletSDK: {
    id: "coinbaseWalletSDK",
    name: "Coinbase Wallet",
    tagline: "Self-custody by Coinbase",
    badge: "Recommended",
    initial: "C",
  },
  safe: {
    id: "safe",
    name: "Safe",
    tagline: "Multi-sig smart account",
    badge: "Hardware",
    initial: "S",
  },
};

function metaFor(c: { id: string; name: string; type?: string }): WalletMeta {
  return (
    WALLET_META[c.id] ?? {
      id: c.id,
      name: c.name,
      tagline: c.type ?? "Wallet provider",
      initial: c.name.slice(0, 1).toUpperCase(),
    }
  );
}

export function ConnectWalletButton({ 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange,
  showTrigger = true
}: { 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean
}) {
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect, isPending, error, variables, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain, isPending: switchPending } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = externalOnOpenChange ?? setInternalOpen;
  const [copied, setCopied] = useState(false);

  const currentChain = chains.find((c) => c.id === chainId);
  const unsupported = isConnected && !currentChain;

  const dedupedConnectors = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      const key = c.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  const pendingConnectorId =
    variables && "connector" in variables
      ? ((variables.connector as { id?: string } | undefined)?.id ?? null)
      : null;

  // --- Disconnected: trigger + modal ---
  if (!isConnected) {
    return (
      <>
        {showTrigger && (
          <Button
            size="sm"
            onClick={() => {
              reset();
              setOpen(true);
            }}
            className="mono h-8 gap-1.5 rounded bg-foreground px-3 text-[11px] font-bold uppercase tracking-tight text-background hover:bg-foreground/90"
          >
            <Wallet className="size-3.5" />
            Connect Wallet
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md gap-0 overflow-hidden border-border bg-surface p-0 sm:max-w-lg">
            {/* Header */}
            <div className="border-b border-border bg-background px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  /// Connect
                </span>
                <span className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-pharos-green pulse-node" />
                  Pharos Testnet · {pharosTestnet.id}
                </span>
              </div>
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-base font-semibold tracking-tight">
                  Connect a wallet
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground">
                  Non-custodial. Signing happens locally — your keys never leave the device.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Wallet list */}
            <div className="max-h-[55vh] overflow-y-auto bg-background px-3 py-3">
              <div className="px-2 pb-2">
                <span className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Providers
                </span>
              </div>
              <ul className="space-y-1">
                {dedupedConnectors.map((c) => {
                  const meta = metaFor(c);
                  const pending = isPending && pendingConnectorId === c.id;
                  return (
                    <li key={c.uid}>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          connect({ connector: c, chainId: pharosTestnet.id })
                        }
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left transition-colors",
                          "hover:border-pharos-blue hover:bg-surface",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                      >
                        <div className="mono flex size-9 shrink-0 items-center justify-center rounded border border-border bg-background text-sm font-bold text-foreground">
                          {pending ? (
                            <Loader2 className="size-4 animate-spin text-pharos-blue" />
                          ) : (
                            meta.initial
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-foreground">
                              {meta.name}
                            </span>
                            {meta.badge && (
                              <Badge
                                variant="outline"
                                className="mono h-4 rounded-sm border-border px-1.5 text-[9px] uppercase tracking-widest text-muted-foreground"
                              >
                                {meta.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="mono mt-0.5 truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                            {pending ? "Confirm in wallet…" : meta.tagline}
                          </p>
                        </div>
                        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-pharos-blue" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {error && (
                <div className="mx-1 mt-3 flex items-start gap-2 rounded-md border border-pharos-red/40 bg-pharos-red/5 p-3">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-pharos-red" />
                  <div className="min-w-0">
                    <p className="mono text-[10px] font-semibold uppercase tracking-widest text-pharos-red">
                      Connection failed
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                      {(error as Error).message ?? "Please try again."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-border bg-surface px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="size-3 text-pharos-green" />
                Non-custodial · No tracking
              </div>
              <a
                href="https://ethereum.org/en/wallets/"
                target="_blank"
                rel="noreferrer"
                className="mono inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-pharos-blue"
              >
                New to wallets?
                <ExternalLink className="size-3" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // --- Wrong network ---
  if (unsupported) {
    if (!showTrigger) return null;
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => switchChain({ chainId: pharosTestnet.id })}
        disabled={switchPending}
        className="mono h-8 gap-1.5 rounded border-pharos-red bg-pharos-red/10 px-3 text-[11px] font-bold uppercase tracking-tight text-pharos-red hover:bg-pharos-red/20 hover:text-pharos-red"
      >
        {switchPending ? <Loader2 className="size-3 animate-spin" /> : <AlertTriangle className="size-3" />}
        Wrong network
      </Button>
    );
  }

  // --- Connected: account dropdown ---
  if (!showTrigger) return null;

  const explorerUrl = currentChain?.blockExplorers?.default?.url
    ? `${currentChain.blockExplorers.default.url}/address/${address}`
    : null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchChain({ chainId: pharosTestnet.id })}
        type="button"
        className="mono hidden items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-pharos-blue hover:text-pharos-blue md:inline-flex"
      >
        <span className="size-1.5 rounded-full bg-pharos-green" />
        {currentChain?.name}
        <ChevronDown className="size-3 opacity-60" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="mono inline-flex items-center gap-2 rounded border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold tracking-tight text-foreground transition-colors hover:border-pharos-blue"
          >
            <span className="size-1.5 rounded-full bg-pharos-green pulse-node" />
            <span className="tabular-nums">{truncate(address)}</span>
            {balance && (
              <span className="text-muted-foreground">
                · {Number(formatUnits(balance.value, balance.decimals)).toFixed(3)} {balance.symbol}
              </span>
            )}
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 border-border bg-surface p-0">
          {/* Account header */}
          <div className="border-b border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                /// {connector?.name ?? "Wallet"}
              </span>
              <span className="mono inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-pharos-green">
                <span className="size-1.5 rounded-full bg-pharos-green pulse-node" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="mono flex size-10 items-center justify-center rounded border border-border bg-surface text-sm font-bold text-foreground">
                {connector?.name?.slice(0, 1) ?? "W"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Address
                </div>
                <div className="mono truncate text-xs font-semibold tabular-nums text-foreground">
                  {truncate(address)}
                </div>
              </div>
            </div>
            {balance && (
              <div className="mt-3 rounded-md border border-border bg-surface px-3 py-2">
                <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Balance
                </div>
                <div className="mt-0.5 text-base font-semibold tabular-nums text-foreground">
                  {Number(formatUnits(balance.value, balance.decimals)).toFixed(4)}{" "}
                  <span className="mono text-[10px] font-normal uppercase tracking-widest text-muted-foreground">
                    {balance.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-1">
            <DropdownMenuLabel className="mono px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={async (e) => {
                e.preventDefault();
                if (address) {
                  await navigator.clipboard.writeText(address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }
              }}
              className="gap-2 text-xs"
            >
              {copied ? <Check className="size-3.5 text-pharos-green" /> : <Copy className="size-3.5" />}
              {copied ? "Copied to clipboard" : "Copy address"}
            </DropdownMenuItem>
            {explorerUrl && (
              <DropdownMenuItem asChild className="gap-2 text-xs">
                <a href={explorerUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                  View on explorer
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                switchChain({ chainId: pharosTestnet.id });
              }}
              className="gap-2 text-xs"
            >
              <ShieldCheck className="size-3.5" />
              Switch network
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                disconnect();
              }}
              className="gap-2 text-xs text-pharos-red focus:bg-pharos-red/10 focus:text-pharos-red"
            >
              <LogOut className="size-3.5" />
              Disconnect
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
