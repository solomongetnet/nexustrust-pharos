import { z } from "zod/v4";

export const greetInputSchema = z.object({
  name: z.string().describe("The name of the person to greet"),
  message: z.string().optional().describe("An optional custom greeting message"),
});

export const addInputSchema = z.object({
  a: z.number().describe("First number to add"),
  b: z.number().describe("Second number to add"),
});

export const listFilesInputSchema = z.object({
  directory: z.string().default("/").describe("Directory path to list"),
});

export const saveItemInputSchema = z.object({
  content: z.string().describe("Content to save to the in-memory array"),
});

export const getItemInputSchema = z.object({
  id: z.number().describe("ID of the item to retrieve"),
});

export const clearItemsInputSchema = z.object({});
