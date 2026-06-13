'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Loader2, Plus, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress } from 'viem';
import { agentRegistryAbi, CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useUploadAgentMetadata } from '@/hooks/api/use-agent-metadata';
import { pharosTestnet } from '@/lib/wagmi';

export default function CreateAgent() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [agentAddress, setAgentAddress] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [socials, setSocials] = useState({ website: '', github: '' });
  const [metadataURI, setMetadataURI] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { address } = useAccount();
  const { writeContractAsync, isPending: isRegistering } = useWriteContract();
  const { mutateAsync: uploadMetadata, isPending: isUploading } = useUploadAgentMetadata();
  const { isLoading: isWaitingForReceipt, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: pharosTestnet.id,
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleUploadMetadata = async () => {
    if (!name || !description || !agentAddress || !isAddress(agentAddress)) return;
    try {
      const result = await uploadMetadata({
        name,
        description,
        image,
        agentAddress,
        owner: address,
        version,
        skills,
        tags,
        socials,
      });
      if (result.ipfsHash) {
        setMetadataURI(`ipfs://${result.ipfsHash}`);
        setStep(3);
      }
    } catch (error) {
      console.error('Error uploading metadata:', error);
    }
  };

  const handleRegister = async () => {
    if (!metadataURI || !agentAddress || !isAddress(agentAddress) || !address) return;
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.agentRegistry,
        abi: agentRegistryAbi,
        functionName: 'registerAgent',
        args: [agentAddress as `0x${string}`, metadataURI],
        chain: pharosTestnet,  // ✅ Required
        account: address,      // ✅ Required
      });

      setTxHash(hash);
    } catch (error) {
      console.error('Error registering agent:', error);
    }
  };

  // When transaction is confirmed, go to step 4
  if (isTxSuccess && !isRegistered) {
    setIsRegistered(true);
    setStep(4);
  }

  const getExplorerTxUrl = (hash: string) => {
    return `${pharosTestnet.blockExplorers.default.url}/tx/${hash}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Basic Info' },
                { num: 2, label: 'Details' },
                { num: 3, label: 'Review' },
                { num: 4, label: 'Complete' }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${step >= s.num
                      ? 'border-emerald-500 bg-emerald-500 text-background'
                      : 'border-border text-muted-foreground'
                      }`}
                  >
                    {step > s.num ? <Check className="size-5" /> : s.num}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-emerald-400' : 'text-muted-foreground'
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-1 rounded-full bg-border">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Step 1 of 4
                </span>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Basic Information
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the core details about your agent.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Agent Name *
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Solidity Auditor Agent"
                      className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Description *
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Autonomous smart contract auditing agent..."
                      className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Agent Address *
                    </Label>
                    <Input
                      value={agentAddress}
                      onChange={(e) => setAgentAddress(e.target.value)}
                      placeholder="0x..."
                      className={`border-border bg-background text-sm focus-visible:ring-emerald-500/40 font-mono ${agentAddress && !isAddress(agentAddress) ? 'border-red-500' : ''}`}
                    />
                    {agentAddress && !isAddress(agentAddress) && (
                      <p className="text-xs text-red-500">
                        Please enter a valid Ethereum address
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Image URL (IPFS/HTTPS)
                    </Label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="ipfs://..."
                      className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!name || !description || !agentAddress || !isAddress(agentAddress)}
                  className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Step 2 of 4
                </span>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Additional Details
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add skills, tags, and social links for your agent.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-8">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Version
                    </Label>
                    <Input
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="1.0.0"
                      className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Skills
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                        >
                          {skill}
                          <button onClick={() => removeSkill(i)} className="hover:text-emerald-200">
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill (e.g., Solidity)"
                        className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                      />
                      <Button
                        onClick={addSkill}
                        variant="secondary"
                        className="border-border"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                        >
                          {tag}
                          <button onClick={() => removeTag(i)} className="hover:text-blue-200">
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add a tag (e.g., audit)"
                        className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                      />
                      <Button
                        onClick={addTag}
                        variant="secondary"
                        className="border-border"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Social Links
                    </Label>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Website</Label>
                        <Input
                          value={socials.website}
                          onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                          placeholder="https://example.com"
                          className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">GitHub</Label>
                        <Input
                          value={socials.github}
                          onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                          placeholder="https://github.com/example"
                          className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  onClick={handleUploadMetadata}
                  disabled={isUploading}
                  className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                      Uploading Metadata...
                    </>
                  ) : (
                    'Upload & Continue'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Register */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Step 3 of 4
                </span>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Review & Register
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review your agent details and register on-chain.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="text-sm font-medium">{name}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Version</Label>
                      <p className="text-sm font-medium">{version}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p className="text-sm">{description}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Agent Address</Label>
                    <p className="text-sm font-mono">{agentAddress}</p>
                  </div>

                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t border-border">
                    <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Metadata URI
                    </Label>
                    <Input
                      value={metadataURI}
                      readOnly
                      className="border-border bg-background text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={isRegistering || isWaitingForReceipt || !!txHash}
                  className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
                >
                  {isRegistering || isWaitingForReceipt ? (
                    <>
                      <Loader2 className="mr-2 size-3.5 animate-spin" />
                      {isRegistering ? 'Registering...' : 'Confirming...'}
                    </>
                  ) : (
                    'Register Agent On-Chain'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="grid size-14 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
                  <Check className="size-7 text-emerald-400" />
                </div>
                <h2 className="mt-4 text-lg font-medium">Agent Registered!</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your agent has been registered on the Pharos network.
                </p>

                <div className="mt-6 w-full space-y-4">
                  <div className="space-y-1 text-left">
                    <Label className="text-xs text-muted-foreground">Metadata URI</Label>
                    <code className="mono block rounded bg-background px-3 py-2 text-[11px] text-emerald-400 break-all">
                      {metadataURI}
                    </code>
                  </div>

                  {txHash && (
                    <div className="space-y-1 text-left">
                      <Label className="text-xs text-muted-foreground">Transaction</Label>
                      <a
                        href={getExplorerTxUrl(txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono flex items-center gap-2 rounded bg-background px-3 py-2 text-[11px] text-blue-400 break-all hover:bg-background/80 transition-colors"
                      >
                        {txHash}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <Link href="/agents">
                    <Button className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400">
                      View All Agents
                    </Button>
                  </Link>
                  <Link href="/agents/mine">
                    <Button variant="secondary" className="mono text-[11px] font-semibold uppercase tracking-widest">
                      My Agents
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
