-- Enum types
CREATE TYPE audit_type AS ENUM ('web', 'design', 'document', 'native_app');
CREATE TYPE audit_scope AS ENUM ('quick', 'typical', 'full_aa', 'full_aaa');
CREATE TYPE audit_status AS ENUM ('draft', 'in_progress', 'completed');
CREATE TYPE sample_type AS ENUM ('structured', 'random');
CREATE TYPE audit_mode AS ENUM ('automated', 'full', 'both');
CREATE TYPE evaluation_outcome AS ENUM ('passed', 'failed', 'inapplicable', 'cantTell', 'untested');
CREATE TYPE finding_priority AS ENUM ('critical', 'major', 'minor', 'advisory');
CREATE TYPE user_role AS ENUM ('auditor', 'admin');
-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'auditor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audits
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auditor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  commissioner TEXT NOT NULL DEFAULT '',
  audit_type audit_type NOT NULL DEFAULT 'web',
  audit_scope audit_scope NOT NULL DEFAULT 'full_aa',
  accessibility_baseline TEXT NOT NULL DEFAULT '',
  executive_summary TEXT NOT NULL DEFAULT '',
  statement_guidance TEXT NOT NULL DEFAULT '',
  owner_contact_phone TEXT NOT NULL DEFAULT '',
  owner_contact_email TEXT NOT NULL DEFAULT '',
  owner_contact_address TEXT NOT NULL DEFAULT '',
  status audit_status NOT NULL DEFAULT 'draft',
  earl_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sample pages
CREATE TABLE sample_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sample_type sample_type NOT NULL DEFAULT 'structured',
  audit_mode audit_mode NOT NULL DEFAULT 'both',
  is_tested BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

-- Audit technologies
CREATE TABLE audit_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  technology_name TEXT NOT NULL,
  technology_url TEXT NOT NULL DEFAULT ''
);

-- Audit results (per criterion per sample page)
CREATE TABLE audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  criterion_id TEXT NOT NULL,
  sample_page_id UUID NOT NULL REFERENCES sample_pages(id) ON DELETE CASCADE,
  outcome evaluation_outcome NOT NULL DEFAULT 'untested',
  observations TEXT NOT NULL DEFAULT '',
  UNIQUE(audit_id, criterion_id, sample_page_id)
);

-- Findings (individual issues within an audit result)
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_result_id UUID NOT NULL REFERENCES audit_results(id) ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT '',
  recommendation TEXT NOT NULL DEFAULT '',
  priority finding_priority NOT NULL DEFAULT 'minor',
  element_selector TEXT NOT NULL DEFAULT '',
  element_html TEXT NOT NULL DEFAULT '',
  from_automated_scan BOOLEAN NOT NULL DEFAULT FALSE,
  auditor_validated BOOLEAN NOT NULL DEFAULT FALSE,
  is_unresolvable BOOLEAN NOT NULL DEFAULT FALSE,
  alternative_solution TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Finding screenshots
CREATE TABLE finding_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scan results (raw axe-core output per sample page)
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_page_id UUID NOT NULL REFERENCES sample_pages(id) ON DELETE CASCADE,
  axe_results JSONB NOT NULL DEFAULT '{}',
  screenshot_path TEXT NOT NULL DEFAULT '',
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX idx_audits_auditor ON audits(auditor_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_sample_pages_audit ON sample_pages(audit_id);
CREATE INDEX idx_audit_results_audit ON audit_results(audit_id);
CREATE INDEX idx_audit_results_sample_page ON audit_results(sample_page_id);
CREATE INDEX idx_findings_audit_result ON findings(audit_result_id);
CREATE INDEX idx_findings_priority ON findings(priority);
CREATE INDEX idx_finding_screenshots_finding ON finding_screenshots(finding_id);
CREATE INDEX idx_scan_results_sample_page ON scan_results(sample_page_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finding_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Users: can read own profile, admins can read all
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_select_admin ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY users_insert ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Audits: auditors see own, admins see all
CREATE POLICY audits_select_own ON audits FOR SELECT USING (auditor_id = auth.uid());
CREATE POLICY audits_select_admin ON audits FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY audits_insert ON audits FOR INSERT WITH CHECK (auditor_id = auth.uid());
CREATE POLICY audits_update_own ON audits FOR UPDATE USING (auditor_id = auth.uid());
CREATE POLICY audits_delete_own ON audits FOR DELETE USING (auditor_id = auth.uid());

-- Sample pages: inherit from audit ownership
CREATE POLICY sample_pages_select ON sample_pages FOR SELECT USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = sample_pages.audit_id AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY sample_pages_insert ON sample_pages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = sample_pages.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY sample_pages_update ON sample_pages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = sample_pages.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY sample_pages_delete ON sample_pages FOR DELETE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = sample_pages.audit_id AND audits.auditor_id = auth.uid())
);

-- Audit technologies: inherit from audit ownership
CREATE POLICY audit_technologies_select ON audit_technologies FOR SELECT USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_technologies.audit_id AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY audit_technologies_insert ON audit_technologies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_technologies.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY audit_technologies_update ON audit_technologies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_technologies.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY audit_technologies_delete ON audit_technologies FOR DELETE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_technologies.audit_id AND audits.auditor_id = auth.uid())
);

-- Audit results: inherit from audit ownership
CREATE POLICY audit_results_select ON audit_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_results.audit_id AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY audit_results_insert ON audit_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_results.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY audit_results_update ON audit_results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_results.audit_id AND audits.auditor_id = auth.uid())
);
CREATE POLICY audit_results_delete ON audit_results FOR DELETE USING (
  EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_results.audit_id AND audits.auditor_id = auth.uid())
);

-- Findings: inherit from audit result → audit ownership
CREATE POLICY findings_select ON findings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM audit_results
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE audit_results.id = findings.audit_result_id
    AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  )
);
CREATE POLICY findings_insert ON findings FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM audit_results
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE audit_results.id = findings.audit_result_id
    AND audits.auditor_id = auth.uid()
  )
);
CREATE POLICY findings_update ON findings FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM audit_results
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE audit_results.id = findings.audit_result_id
    AND audits.auditor_id = auth.uid()
  )
);
CREATE POLICY findings_delete ON findings FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM audit_results
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE audit_results.id = findings.audit_result_id
    AND audits.auditor_id = auth.uid()
  )
);

-- Finding screenshots: inherit from finding → audit result → audit
CREATE POLICY finding_screenshots_select ON finding_screenshots FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM findings
    JOIN audit_results ON audit_results.id = findings.audit_result_id
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE findings.id = finding_screenshots.finding_id
    AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  )
);
CREATE POLICY finding_screenshots_insert ON finding_screenshots FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM findings
    JOIN audit_results ON audit_results.id = findings.audit_result_id
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE findings.id = finding_screenshots.finding_id
    AND audits.auditor_id = auth.uid()
  )
);
CREATE POLICY finding_screenshots_delete ON finding_screenshots FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM findings
    JOIN audit_results ON audit_results.id = findings.audit_result_id
    JOIN audits ON audits.id = audit_results.audit_id
    WHERE findings.id = finding_screenshots.finding_id
    AND audits.auditor_id = auth.uid()
  )
);

-- Scan results: inherit from sample page → audit
CREATE POLICY scan_results_select ON scan_results FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sample_pages
    JOIN audits ON audits.id = sample_pages.audit_id
    WHERE sample_pages.id = scan_results.sample_page_id
    AND (audits.auditor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'))
  )
);
CREATE POLICY scan_results_insert ON scan_results FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM sample_pages
    JOIN audits ON audits.id = sample_pages.audit_id
    WHERE sample_pages.id = scan_results.sample_page_id
    AND audits.auditor_id = auth.uid()
  )
);

-- Storage bucket policy (applied via Supabase dashboard)
-- Bucket: finding-screenshots
-- SELECT: authenticated users can view screenshots from their own audits
-- INSERT: authenticated users can upload to their own audit paths
