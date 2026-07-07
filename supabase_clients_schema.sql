-- SUMMIT VOICE AI — Clients Table Schema
-- Run this in Supabase SQL Editor: supabase.com → your project → SQL Editor → New Query
-- Paste this entire file and click Run

-- ── CLIENTS TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),

    -- Identity
    company_name            TEXT NOT NULL,
    contact_name            TEXT,
    phone                   TEXT,
    email                   TEXT,

    -- GHL
    ghl_contact_id          TEXT UNIQUE,
    ghl_opportunity_id      TEXT,

    -- Billing
    tier                    INTEGER DEFAULT 1 CHECK (tier IN (1, 2, 3)),
    mrr                     INTEGER DEFAULT 497,
    setup_fee               INTEGER DEFAULT 0,
    billing_start           DATE,
    next_billing            DATE,

    -- Ava Setup
    ava_agent_id            TEXT,
    widget_key              TEXT,
    thinker_url             TEXT,
    voice_name              TEXT DEFAULT 'Marissa',

    -- Websites
    website_url             TEXT,
    demo_url                TEXT,

    -- Status
    status                  TEXT DEFAULT 'onboarding'
                            CHECK (status IN ('onboarding', 'active', 'at-risk', 'churned', 'paused')),
    churn_risk_flag         BOOLEAN DEFAULT FALSE,
    churn_risk_reason       TEXT,

    -- Performance Stats (cumulative)
    calls_answered_total    INTEGER DEFAULT 0,
    bookings_made_total     INTEGER DEFAULT 0,
    reviews_requested_total INTEGER DEFAULT 0,
    reviews_received_total  INTEGER DEFAULT 0,

    -- Reporting
    last_report_sent        TIMESTAMPTZ,
    last_check_in           TIMESTAMPTZ,

    -- Notes
    notes                   TEXT,
    onboarding_notes        TEXT
);

-- ── WEEKLY CLIENT STATS TABLE ──────────────────────────────────────────────
-- Stores weekly performance snapshots per client
CREATE TABLE IF NOT EXISTS client_weekly_stats (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    client_id           UUID REFERENCES clients(id) ON DELETE CASCADE,
    week_of             DATE NOT NULL,

    calls_answered      INTEGER DEFAULT 0,
    calls_missed        INTEGER DEFAULT 0,
    bookings_made       INTEGER DEFAULT 0,
    reviews_requested   INTEGER DEFAULT 0,
    reviews_received    INTEGER DEFAULT 0,

    engagement_score    INTEGER,  -- 1-10, calculated by client_manager.py
    report_sent         BOOLEAN DEFAULT FALSE,
    report_sent_at      TIMESTAMPTZ
);

-- ── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clients_status     ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_ghl        ON clients(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_client_stats_week  ON client_weekly_stats(client_id, week_of);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_weekly_stats ENABLE ROW LEVEL SECURITY;

-- Allow service_role (Railway backend) full access
CREATE POLICY "service_role_clients" ON clients
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_client_stats" ON client_weekly_stats
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── SEED: Dan's 9 current clients (update with real data) ──────────────────
-- Uncomment and fill in real details before running
/*
INSERT INTO clients (company_name, tier, mrr, status) VALUES
    ('Client 1 Roofing',   1, 497, 'active'),
    ('Client 2 Roofing',   1, 497, 'active'),
    ('Client 3 Roofing',   2, 797, 'active'),
    ('Client 4 Roofing',   1, 497, 'active'),
    ('Client 5 Roofing',   1, 497, 'active'),
    ('Client 6 Roofing',   1, 497, 'active'),
    ('Client 7 Roofing',   1, 497, 'active'),
    ('Client 8 Roofing',   3, 997, 'active'),
    ('Client 9 Roofing',   1, 497, 'active');
*/

-- ── VERIFY ──────────────────────────────────────────────────────────────────
SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS size
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('clients', 'client_weekly_stats')
ORDER BY table_name;
