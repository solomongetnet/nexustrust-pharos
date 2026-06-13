import { GoogleGenAI } from "@google/genai";

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
export const aiConfig = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY });