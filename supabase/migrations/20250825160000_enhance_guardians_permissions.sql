-- Enhance guardians table with granular permissions for Family Shield Protocol
-- Add permission columns for granular access control

-- Add new permission columns to guardians table
ALTER TABLE guardians 
ADD COLUMN can_trigger_emergency BOOLEAN DEFAULT false,
ADD COLUMN can_access_health_docs BOOLEAN DEFAULT false,
ADD COLUMN can_access_financial_docs BOOLEAN DEFAULT false,
ADD COLUMN is_child_guardian BOOLEAN DEFAULT false,
ADD COLUMN is_will_executor BOOLEAN DEFAULT false,
ADD COLUMN emergency_contact_priority INTEGER DEFAULT 1;

-- Add index for emergency contact priority
CREATE INDEX idx_guardians_emergency_priority ON guardians(user_id, emergency_contact_priority) 
WHERE can_trigger_emergency = true;

-- Add comments for new columns
COMMENT ON COLUMN guardians.can_trigger_emergency IS 'Can this guardian trigger the emergency protocol';
COMMENT ON COLUMN guardians.can_access_health_docs IS 'Has access to health-related documents';
COMMENT ON COLUMN guardians.can_access_financial_docs IS 'Has access to financial documents';
COMMENT ON COLUMN guardians.is_child_guardian IS 'Is designated as a child guardian';
COMMENT ON COLUMN guardians.is_will_executor IS 'Is designated as will executor';
COMMENT ON COLUMN guardians.emergency_contact_priority IS 'Priority order for emergency contacts (1 = highest)';

-- Add constraint to ensure priority is positive
ALTER TABLE guardians ADD CONSTRAINT guardians_priority_positive 
CHECK (emergency_contact_priority > 0);