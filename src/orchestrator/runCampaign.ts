import { getCompanyInsights } from '@/integrations/research.js';
import { scrapeLinkedInProfile } from '@/linkedin/scraper-bridge.js';
import { findEmailWithHunter } from '@/integrations/hunter.js';
import { buildICP } from '@/icp/fuse.js';
import { sendEmailViaSendPulse } from '@/integrations/sendpulse.js';

export async function runCampaign(companyName: string, contactName: string, link: string) {
  const insights = await getCompanyInsights(companyName);
  const profile = await scrapeLinkedInProfile(link);
  const email = await findEmailWithHunter();
  const icp = await buildICP({ name: companyName }, profile);

  return { status:"ok", insights, profile, icp };
}
