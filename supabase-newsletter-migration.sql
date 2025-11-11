-- Newsletter Subscriptions Table Migration
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Information
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,

  -- Location Data (IP-based geolocation)
  country_code VARCHAR(10),
  country_name VARCHAR(100),
  city VARCHAR(100),

  -- Browser/Client Data
  timezone VARCHAR(100),
  browser_language VARCHAR(10),
  page_locale VARCHAR(5), -- en, fr, de, es

  -- Metadata
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  source VARCHAR(50) DEFAULT 'website_modal',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);
CREATE INDEX idx_newsletter_is_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_country_code ON newsletter_subscriptions(country_code);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on row update
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for website subscription)
CREATE POLICY "Allow public insert for newsletter subscriptions"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all (for admin dashboard)
CREATE POLICY "Allow authenticated users to read newsletter subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update (for admin management)
CREATE POLICY "Allow authenticated users to update newsletter subscriptions"
  ON newsletter_subscriptions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to delete (for admin management)
CREATE POLICY "Allow authenticated users to delete newsletter subscriptions"
  ON newsletter_subscriptions
  FOR DELETE
  TO authenticated
  USING (true);

-- Add some comments for documentation
COMMENT ON TABLE newsletter_subscriptions IS 'Stores newsletter subscription data with geolocation information';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'Unique email address of subscriber';
COMMENT ON COLUMN newsletter_subscriptions.country_code IS 'ISO country code from IP geolocation';
COMMENT ON COLUMN newsletter_subscriptions.timezone IS 'Browser timezone (e.g., America/New_York)';
COMMENT ON COLUMN newsletter_subscriptions.page_locale IS 'Website language when user subscribed (en/fr/de/es)';
COMMENT ON COLUMN newsletter_subscriptions.is_active IS 'Whether subscription is active (false if unsubscribed)';
