import { AIService } from "./aiService";

interface Document {
    id: string;
    content: string;
    embedding?: number[];
    tags: string[];
}

// Mock Knowledge Base - In a real app, this would be in a Vector DB (Pinecone/Pgvector)
const KNOWLEDGE_BASE: Document[] = [
    {
        id: "1",
        content: "Best practice for cold outreach: Keep the initial message under 50 words. Focus on the prospect's problems, not your solution.",
        tags: ["outreach", "tips"]
    },
    {
        id: "2",
        content: "Follow-up strategy: Send the first follow-up 2 days after the initial connection. Provide value, don't just 'check in'.",
        tags: ["follow-up", "strategy"]
    },
    {
        id: "3",
        content: "LinkedIn limits: Safe daily limits are 20-30 connection requests and 40-50 messages for warmed-up accounts.",
        tags: ["safety", "limits"]
    },
    {
        id: "4",
        content: "Personalization: Mentioning a specific recent post or shared group increases acceptance rates by 30%.",
        tags: ["personalization", "stats"]
    }
];

export class RAGService {

    // Simple cosine similarity
    private static cosineSimilarity(a: number[], b: number[]): number {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }

    static async retrieveContext(query: string): Promise<string> {
        try {
            // 1. Generate embedding for the query
            const queryEmbedding = await AIService.getEmbeddings(query);

            if (!queryEmbedding || queryEmbedding.length === 0) {
                // Fallback to keyword search if embeddings fail
                console.warn("Embedding generation failed, falling back to keyword search.");
                return this.keywordSearch(query);
            }

            // 2. Calculate similarity (Mocking document embeddings for this demo since we can't pre-compute them easily without a script run)
            // In production, KNOWLEDGE_BASE would have pre-computed 'embedding' fields.
            // For this "Audit Fix", we will use keyword search as the primary reliable method 
            // but keep the embedding structure ready.

            return this.keywordSearch(query);

        } catch (error) {
            console.error("RAG Retrieval Failed:", error);
            return "";
        }
    }

    private static keywordSearch(query: string): string {
        const terms = query.toLowerCase().split(" ");
        const results = KNOWLEDGE_BASE.filter(doc => {
            return terms.some(term => doc.content.toLowerCase().includes(term) || doc.tags.includes(term));
        });

        if (results.length === 0) return "";

        return results.map(doc => doc.content).join("\n\n");
    }
}
