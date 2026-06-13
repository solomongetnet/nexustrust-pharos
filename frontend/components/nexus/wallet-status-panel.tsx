"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plug,
  PlugZap,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { pharosTestnet } from "@/lib/wagmi";

/** Translate noisy wallet/provider errors into precise, human-readable reasons. */
function explainError(err: unknown): { code: string; reason: string; hint?: string } {
  if (!err) return { code: "UNKNOWN", reason: "Unknown error" };
  const e = err as { name?: string; code?: number | string; shortMessage?: string; message?: string };
  const raw = (e.shortMessage || e.message || "").toString();
  const code = e.code;

  if (e.name === "ConnectorNotFoundError" || /not\s*found/i.test(raw))
    return {
      code: "NO_PROVIDER",
      reason: "No wallet provider detected in this browser.",
      hint: "Install MetaMask or another EIP-1193 wallet, then retry.",
    };
  if (code === 4001 || /reject|denied|user\s*rejected/i.test(raw))
    return {
      code: "USER_REJECTED",
      reason: "Request rejected in the wallet popup.",
      hint: "Re-open your wallet and approve the connection request.",
    };
  if (code === -32002 || /already\s*pending|already\s*processing/i.test(raw))
    return {
      code: "REQUEST_PENDING",
      reason: "A connection request is already pending in your wallet.",
      hint: "Open the wallet extension and approve or dismiss the existing request.",
    };
  if (code === 4902 || /unrecognized\s*chain|chain.*not\s*added/i.test(raw))
    return {
      code: "CHAIN_NOT_ADDED",
      reason: "Pharos Devnet is not yet added to this wallet.",
      hint: "Click ‘Switch to Pharos Devnet’ — the wallet will prompt you to add it.",
    };
  if (/switch.*chain|wrong\s*network/i.test(raw))
    return {
      code: "SWITCH_FAILED",
      reason: "Wallet refused to switch networks.",
      hint: "Switch manually inside your wallet, then refresh.",
    };
  if (/timeout|timed\s*out/i.test(raw))
    return { code: "TIMEOUT", reason: "Wallet did not respond in time.", hint: "Unlock your wallet and retry." };
  if (/network|fetch|connection/i.test(raw))
    return { code: "NETWORK", reason: "RPC connection failed.", hint: "Check your internet or RPC endpoint." };

  return { code: "WALLET_ERROR", reason: raw || "Wallet returned an unexpected error." };
}

export function WalletStatusPanel() {
  const { address, isConnected, isConnecting, isReconnecting, connector, status } = useAccount();
  const { connectors, connect, error: connectError, isPending: connectPending, variables } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain, error: switchError, isPending: switchPending } = useSwitchChain();
  const { data: balance, isLoading: balanceLoading, error: balanceError, refetch } = useBalance({ address });

  const [lastErrorAt, setLastErrorAt] = useState<string | null>(null);
  useEffect(() => {
    if (connectError || switchError || balanceError) {
      setLastErrorAt(new Date().toLocaleTimeString());
    }
  }, [connectError, switchError, balanceError]);

  const currentChain = chains.find((c) => c.id === chainId);
  const wrongNetwork = isConnected && !currentChain;
  const activeError = connectError ?? switchError ?? balanceError ?? null;
  const explained = activeError ? explainError(activeError) : null;

  let state: "disconnected" | "connecting" | "wrong-network" | "ready" | "error" = "disconnected";
  if (explained) state = "error";
  else if (isConnecting || isReconnecting || connectPending) state = "connecting";
  else if (wrongNetwork) state = "wrong-network";
  else if (isConnected) state = "ready";

  const stateMeta = {
    disconnected: { label: "Disconnected", color: "text-muted-foreground", dot: "bg-muted-foreground", Icon: Plug },
    connecting: { label: "Negotiating", color: "text-pharos-amber", dot: "bg-pharos-amber pulse-node", Icon: Loader2 },
    "wrong-network": { label: "Wrong Network", color: "text-pharos-red", dot: "bg-pharos-red pulse-node", Icon: AlertTriangle },
    ready: { label: "Operational", color: "text-pharos-green", dot: "bg-pharos-green pulse-node", Icon: CheckCircle2 },
    error: { label: "Fault", color: "text-pharos-red", dot: "bg-pharos-red pulse-node", Icon: XCircle },
  }[state];

  const StateIcon = stateMeta.Icon;
  const pendingConnectorName =
    variables && "connector" in variables
      ? (variables.connector as { name?: string } | undefined)?.name
      : undefined;

  return (
    <div className="rounded-lg border border-border bg-surface/60 p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Wallet Status
        </h3>
        <span className={`mono inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${stateMeta.color}`}>
          <span className={`size-1.5 rounded-full ${stateMeta.dot}`} />
          {stateMeta.label}
        </span>
      </div>

      {/* Primary readout */}
      <div className="mb-4 flex items-start gap-3 rounded border border-border/70 bg-background/60 p-3">
        <div className={`mt-0.5 ${stateMeta.color}`}>
          <StateIcon className={`size-4 ${state === "connecting" ? "animate-spin" : ""}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Active Wallet</div>
          <div className="mt-0.5 truncate text-sm font-medium text-foreground">
            {isConnected
              ? connector?.name ?? "Unknown connector"
              : connectPending
                ? `Connecting to ${pendingConnectorName ?? "wallet"}…`
                : "None"}
          </div>
          {isConnected && (
            <div className="mono mt-1 text-[10px] text-muted-foreground">
              type: {connector?.type ?? "—"} · id: {connector?.id ?? "—"}
            </div>
          )}
        </div>
      </div>

      {/* Connection grid */}
      <dl className="mb-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
        <Row label="Status" value={status} />
        <Row
          label="Address"
          value={address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
          mono
        />
        <Row
          label="Chain"
          value={currentChain?.name ?? (chainId ? `Unknown (${chainId})` : "—")}
          tone={wrongNetwork ? "danger" : isConnected ? "ok" : "muted"}
        />
        <Row
          label="Balance"
          value={
            balanceLoading
              ? "loading…"
              : balance
                ? `${Number((balance as any).formatted as any).toFixed(4)} ${balance.symbol}`
                : "—"
          }
          mono
        />
      </dl>

      {/* Error panel — precise failure reason */}
      {explained && (
        <div className="mb-4 rounded border border-pharos-red/40 bg-pharos-red/5 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="mono text-[10px] font-semibold uppercase tracking-widest text-pharos-red">
              Failure · {explained.code}
            </span>
            {lastErrorAt && (
              <span className="mono text-[10px] text-muted-foreground">{lastErrorAt}</span>
            )}
          </div>
          <p className="text-[12px] leading-snug text-foreground">{explained.reason}</p>
          {explained.hint && (
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{explained.hint}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {!isConnected &&
          connectors.map((c) => (
            <button
              key={c.uid}
              type="button"
              onClick={() => connect({ connector: c, chainId: pharosTestnet.id })}
              disabled={connectPending}
              className="mono inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-pharos-blue hover:text-pharos-blue disabled:opacity-50"
            >
              <PlugZap className="size-3" />
              {c.name}
            </button>
          ))}

        {wrongNetwork && (
          <button
            type="button"
            onClick={() => switchChain({ chainId: pharosTestnet.id })}
            disabled={switchPending}
            className="mono inline-flex items-center gap-1.5 rounded border border-pharos-red bg-pharos-red/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-pharos-red disabled:opacity-50"
          >
            {switchPending ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
            Switch to {pharosTestnet.name}
          </button>
        )}

        {isConnected && (
          <>
            <button
              type="button"
              onClick={() => refetch()}
              className="mono inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-pharos-blue hover:text-pharos-blue"
            >
              <RefreshCw className="size-3" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => disconnect()}
              className="mono inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-pharos-red hover:border-pharos-red"
            >
              <XCircle className="size-3" /> Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  tone = "default",
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "default" | "ok" | "danger" | "muted";
}) {
  const toneCls =
    tone === "ok"
      ? "text-pharos-green"
      : tone === "danger"
        ? "text-pharos-red"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <>
      <dt className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={`${mono ? "mono " : ""}truncate text-right ${toneCls}`}>{value}</dd>
    </>
  );
}
