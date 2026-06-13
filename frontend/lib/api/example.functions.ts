"use server";

import { z } from "zod";

import { getServerConfig } from "../config.server";

// Example Next.js Server Action
export async function getGreeting(data: { name: string }) {
  const schema = z.object({ name: z.string().min(1) });
  const parsed = schema.parse(data);
  const config = getServerConfig();
  return {
    greeting: `Hello, ${parsed.name}!`,
    mode: config.nodeEnv ?? "unknown",
  };
}
