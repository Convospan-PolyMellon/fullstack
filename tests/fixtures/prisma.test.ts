/**
 * ✅ Prisma Vector + EngagementLog Test
 * Run after migrating schema to verify RAG + Automation logging setup.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Prisma verification test...\n');

  // 1️⃣ Insert mock VectorDocument
  const vectorDoc = await prisma.vectorDocument.create({
    data: {
      type: 'linkedin',
      content: 'John Doe is Head of Operations at Acme Corp.',
      metadata: JSON.stringify({ company: 'Acme Corp', role: 'Operations Head' }),
      embedding: JSON.stringify([0.12, 0.45, 0.33, 0.91]),
    },
  });

  console.log('✅ VectorDocument inserted:', vectorDoc);

  // 2️⃣ Query recently added vector
  const foundVectors = await prisma.vectorDocument.findMany({
    where: { type: 'linkedin' },
    orderBy: { created_at: 'desc' },
    take: 1,
  });

  console.log('\n🔍 Retrieved latest vector doc:', foundVectors[0]);

  // 3️⃣ Insert mock EngagementLog
  const engagementLog = await prisma.engagementLog.create({
    data: {
      email: 'john.doe@acmecorp.com',
      event: 'email_sent',
      context: 'Sent personalized outreach based on company insights',
      result: JSON.stringify({
        subject: 'Helping Acme optimize operations with AI-driven analytics',
        status: 'sent',
        timestamp: new Date().toISOString(),
      }),
    },
  });

  console.log('\n✅ EngagementLog inserted:', engagementLog);

  // 4️⃣ Query engagement logs
  const logs = await prisma.engagementLog.findMany({
    where: { email: 'john.doe@acmecorp.com' },
  });

  console.log('\n📬 Retrieved engagement logs:', logs);

  console.log('\n🎯 Prisma VectorDocument + EngagementLog test completed successfully!');
}

describe('Prisma Tests', () => {
  it('should run the full prisma test flow', async () => {
    await main();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
