-- Create user protocol settings table for Family Shield Protocol configuration
CREATE TABLE user_protocol_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inactivity_period_months INTEGER DEFAULT 6 CHECK (inactivity_period_months > 0),
  required_guardians_for_activation INTEGER DEFAULT 2 CHECK (required_guardians_for_activation > 0),
  is_protocol_enabled BOOLEAN DEFAULT false,
  last_activity_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  protocol_status VARCHAR(20) DEFAULT 'inactive' CHECK (protocol_status IN ('inactive', 'pending_verification', 'active')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE user_protocol_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own settings
CREATE POLICY "Users can view own protocol settings" ON user_protocol_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert own protocol settings" ON user_protocol_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update own protocol settings" ON user_protocol_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_protocol_settings_user_id ON user_protocol_settings(user_id);
CREATE INDEX idx_protocol_settings_status ON user_protocol_settings(protocol_status);
CREATE INDEX idx_protocol_settings_activity_check ON user_protocol_settings(last_activity_check) 
WHERE protocol_status = 'inactive';

-- Ensure one settings record per user
CREATE UNIQUE INDEX idx_protocol_settings_user_unique ON user_protocol_settings(user_id);

-- Add updated_at trigger
CREATE TRIGGER update_protocol_settings_updated_at 
  BEFORE UPDATE ON user_protocol_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE user_protocol_settings IS 'User-specific Family Shield Protocol configuration';
COMMENT ON COLUMN user_protocol_settings.user_id IS 'Reference to the user who owns these settings';
COMMENT ON COLUMN user_protocol_settings.inactivity_period_months IS 'Months of inactivity before protocol verification begins';
COMMENT ON COLUMN user_protocol_settings.required_guardians_for_activation IS 'Number of guardians needed to manually activate protocol';
COMMENT ON COLUMN user_protocol_settings.is_protocol_enabled IS 'Whether the Family Shield Protocol is enabled';
COMMENT ON COLUMN user_protocol_settings.last_activity_check IS 'Last time user activity was checked';
COMMENT ON COLUMN user_protocol_settings.protocol_status IS 'Current status of the protocol (inactive, pending_verification, active)';