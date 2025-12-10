import { prisma } from "@/lib/db";

import { getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                // @ts-ignore
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export async function getCurrentContext() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { userId: null, teamId: null };
    }

    // @ts-ignore
    const userId = session.user.id;

    // Get user's active team (for now, just the first one)
    const membership = await prisma.teamMember.findFirst({
        where: { userId },
        select: { teamId: true }
    });

    // If no team, create a default one (onboarding logic)
    if (!membership) {
        return { userId, teamId: null };
    }

    return { userId, teamId: membership.teamId };
}
