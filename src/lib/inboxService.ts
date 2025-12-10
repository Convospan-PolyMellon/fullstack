import { runLinkedInAction } from "@/linkedin/puppeteerRunner";

// Mock data types
export interface Thread {
    id: string;
    leadId: string;
    leadName: string;
    leadAvatar?: string;
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
}

export interface Message {
    id: string;
    threadId: string;
    sender: "me" | "them";
    content: string;
    createdAt: Date;
}

export class InboxService {
    // Mock data store
    private static threads: Thread[] = [
        {
            id: "1",
            leadId: "lead-1",
            leadName: "Alice Johnson",
            lastMessage: "Thanks for connecting! I'd love to chat more.",
            lastMessageAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            unreadCount: 1
        },
        {
            id: "2",
            leadId: "lead-2",
            leadName: "Bob Smith",
            lastMessage: "Sure, let's schedule a call next week.",
            lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            unreadCount: 0
        }
    ];

    private static messages: Record<string, Message[]> = {
        "1": [
            { id: "m1", threadId: "1", sender: "me", content: "Hi Alice, thanks for accepting my request.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: "m2", threadId: "1", sender: "them", content: "Thanks for connecting! I'd love to chat more.", createdAt: new Date(Date.now() - 1000 * 60 * 60) }
        ],
        "2": [
            { id: "m3", threadId: "2", sender: "me", content: "Hi Bob, are you open to a quick call?", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25) },
            { id: "m4", threadId: "2", sender: "them", content: "Sure, let's schedule a call next week.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) }
        ]
    };

    static async getThreads(): Promise<Thread[]> {
        // In a real app, this would fetch from DB or scrape LinkedIn
        return this.threads;
    }

    static async getMessages(threadId: string): Promise<Message[]> {
        return this.messages[threadId] || [];
    }

    static async sendMessage(threadId: string, content: string) {
        // 1. Find the thread to get the URL (in real app)
        // For now, we assume we have the URL or just mock the action
        const thread = this.threads.find(t => t.id === threadId);
        if (!thread) throw new Error("Thread not found");

        // 2. Add message to local mock store
        if (!this.messages[threadId]) this.messages[threadId] = [];
        this.messages[threadId].push({
            id: Date.now().toString(),
            threadId,
            sender: "me",
            content,
            createdAt: new Date()
        });

        // 3. Trigger actual LinkedIn action (if we had the URL)
        // const result = await runLinkedInAction({
        //     type: "REPLY", // We need to implement this in puppeteerRunner
        //     url: "https://www.linkedin.com/messaging/thread/...", 
        //     message: content
        // });

        // For now, just return success
        return { success: true };
    }
}
