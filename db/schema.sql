-- PostgreSQL schema for CRM/Marketing platform
-- Compatible with Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE engagement_type AS ENUM ('email', 'call', 'meeting', 'note', 'task', 'other');
CREATE TYPE engagement_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE engagement_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE asset_type AS ENUM ('document', 'image', 'video', 'template', 'other');

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    description TEXT,
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(150),
    department VARCHAR(100),
    linkedin_url VARCHAR(500),
    seniority VARCHAR(50),
    is_decision_maker BOOLEAN,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ICP Profiles table
CREATE TABLE icp_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icp_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type asset_type NOT NULL,
    url VARCHAR(1000),
    file_path VARCHAR(1000),
    description TEXT,
    tags TEXT[],
    size_bytes BIGINT,
    mime_type VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status campaign_status NOT NULL DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12, 2),
    target_audience TEXT,
    objectives TEXT[],
    assets UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement logs table
CREATE TABLE engagement_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    type engagement_type NOT NULL,
    subject VARCHAR(500),
    content TEXT,
    direction engagement_direction,
    status engagement_status DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_engagement_logs_company_id ON engagement_logs(company_id);
CREATE INDEX idx_engagement_logs_contact_id ON engagement_logs(contact_id);
CREATE INDEX idx_engagement_logs_campaign_id ON engagement_logs(campaign_id);
CREATE INDEX idx_engagement_logs_type ON engagement_logs(type);
CREATE INDEX idx_engagement_logs_scheduled_at ON engagement_logs(scheduled_at);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_end_date ON campaigns(end_date);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_industry ON companies(industry);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_icp_profiles_updated_at BEFORE UPDATE ON icp_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engagement_logs_updated_at BEFORE UPDATE ON engagement_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) for Supabase
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE icp_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_logs ENABLE ROW LEVEL SECURITY;

-- Default policies (adjust as needed for your auth strategy)
CREATE POLICY "Enable read access for all users" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON companies
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON companies
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON contacts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON contacts
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON contacts
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON icp_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON icp_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON icp_profiles
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON icp_profiles
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON assets
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON assets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON assets
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON assets
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON campaigns
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON campaigns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON campaigns
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON campaigns
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON engagement_logs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON engagement_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON engagement_logs
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON engagement_logs
    FOR DELETE USING (true);