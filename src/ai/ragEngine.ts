import { searchSimilar } from './vectorStore.js';
import { generateWithGemini } from './gemini.js';

export async function extractKeyInsights(q: string) {
  return { summary: "mock", docsCount: 0 };
}

export async function buildRAGContext(seed: string) {
  return { context: "", docs: [] };
}
