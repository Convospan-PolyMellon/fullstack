import { v4 as uuidv4 } from "uuid";

export type Document = {
    id: string;
    content: string;
    metadata?: any;
    embedding?: number[];
};

class VectorStore {
    private documents: Document[] = [];

    async addDocument(content: string, metadata?: any) {
        const doc: Document = {
            id: uuidv4(),
            content,
            metadata,
            embedding: await this.getEmbedding(content),
        };
        this.documents.push(doc);
        return doc;
    }

    async search(query: string, limit: number = 5) {
        const queryEmbedding = await this.getEmbedding(query);

        const results = this.documents.map(doc => ({
            ...doc,
            score: this.cosineSimilarity(queryEmbedding, doc.embedding!),
        }));

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Mock embedding generation (random for now, replace with OpenAI/Gemini)
    private async getEmbedding(text: string): Promise<number[]> {
        // Simulate latency
        await new Promise(resolve => setTimeout(resolve, 100));
        return Array(1536).fill(0).map(() => Math.random());
    }

    private cosineSimilarity(a: number[], b: number[]) {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
}

export const vectorStore = new VectorStore();
