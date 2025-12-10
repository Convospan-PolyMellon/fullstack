import { Client } from "@hubspot/api-client";

class CRMService {
    private hubspotClient: Client;

    constructor() {
        this.hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
    }

    async syncLead(lead: any) {
        if (!process.env.HUBSPOT_ACCESS_TOKEN) {
            console.warn("HUBSPOT_ACCESS_TOKEN not found, skipping sync.");
            return { status: "skipped", reason: "No API token" };
        }

        try {
            // Check if contact exists
            const publicObjectSearchRequest = {
                filterGroups: [
                    {
                        filters: [
                            {
                                propertyName: 'email',
                                operator: 'EQ' as any,
                                value: lead.email
                            }
                        ]
                    }
                ],
                sorts: ['email'],
                properties: ['email', 'firstname', 'lastname', 'company'],
                limit: 1,
                after: "0"
            };

            const searchResult = await this.hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest);

            if (searchResult.total > 0) {
                console.log(`Contact ${lead.email} already exists in HubSpot.`);
                return { status: "exists", crmId: searchResult.results[0].id };
            }

            // Create contact
            const [firstname, ...lastnameParts] = (lead.fullName || "").split(" ");
            const lastname = lastnameParts.join(" ");

            const contactObj = {
                properties: {
                    email: lead.email,
                    firstname: firstname || "",
                    lastname: lastname || "",
                    company: lead.company || "",
                    jobtitle: lead.jobTitle || "",
                    website: lead.linkedIn || ""
                }
            };

            const createContactResponse = await this.hubspotClient.crm.contacts.basicApi.create(contactObj);
            console.log(`Synced lead ${lead.email} to HubSpot. ID: ${createContactResponse.id}`);

            return {
                status: "success",
                crmId: createContactResponse.id,
                syncedAt: new Date().toISOString()
            };

        } catch (error: any) {
            console.error("HubSpot Sync Error:", error);
            throw new Error(`HubSpot Sync Failed: ${error.message}`);
        }
    }
}

export const crmService = new CRMService();
