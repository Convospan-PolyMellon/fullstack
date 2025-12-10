import { vectorStore } from "./vectorStore";

class IngestService {
    async ingestText(text: string, metadata?: any) {
        // Simple chunking by paragraph
        const chunks = text.split("\n\n").filter(c => c.trim().length > 0);

        const results = [];
        for (const chunk of chunks) {
            const doc = await vectorStore.addDocument(chunk, metadata);
            results.push(doc);
        }

        return results;
    }
}

export const ingestService = new IngestService();
