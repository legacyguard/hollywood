export type DeliveryCondition = 'ON_DATE' | 'ON_DEATH';
export type CapsuleStatus = 'PENDING' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
export type CapsuleFileType = 'video' | 'audio';

export interface TimeCapsule {
  id: string;
  user_id: string;
  recipient_id?: string | null;
  recipient_name: string;
  recipient_email: string;
  delivery_condition: DeliveryCondition;
  delivery_date?: string | null;
  message_title: string;
  message_preview?: string | null;
  storage_path: string;
  file_type: CapsuleFileType;
  file_size_bytes?: number | null;
  duration_seconds?: number | null;
  thumbnail_path?: string | null;
  access_token: string;
  status: CapsuleStatus;
  is_delivered: boolean;
  delivered_at?: string | null;
  delivery_attempts: number;
  last_delivery_attempt?: string | null;
  delivery_error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTimeCapsuleRequest {
  recipient_id?: string;
  recipient_name: string;
  recipient_email: string;
  delivery_condition: DeliveryCondition;
  delivery_date?: string;
  message_title: string;
  message_preview?: string;
  file_type: CapsuleFileType;
  file_size_bytes?: number;
  duration_seconds?: number;
}

export interface UpdateTimeCapsuleRequest extends Partial<CreateTimeCapsuleRequest> {
  status?: CapsuleStatus;
}

export interface TimeCapsuleRecordingData {
  blob: Blob;
  duration: number;
  fileType: CapsuleFileType;
  thumbnail?: Blob; // For video recordings
}

export interface TimeCapsuleWizardStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface RecipientOption {
  id?: string;
  name: string;
  email: string;
  relationship?: string;
  isGuardian: boolean;
}

// For the secure viewing page
export interface TimeCapsuleAccess {
  capsule: TimeCapsule;
  user_name: string;
  signed_url: string; // Pre-signed URL for video/audio file
  thumbnail_url?: string; // Pre-signed URL for thumbnail if exists
}

// For delivery system
export interface TimeCapsuleDelivery {
  capsule_id: string;
  user_id: string;
  recipient_name: string;
  recipient_email: string;
  message_title: string;
  access_token: string;
  delivery_condition: DeliveryCondition;
}

// Recording constraints for MediaRecorder
export interface RecordingConstraints {
  video?: {
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    sampleRate: number;
  };
}

export const DEFAULT_RECORDING_CONSTRAINTS: RecordingConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  }
};

export const MAX_RECORDING_DURATION = 300; // 5 minutes in seconds
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

// Helper types for UI state management
export interface TimeCapsuleFormData {
  recipient: RecipientOption | null;
  deliveryCondition: DeliveryCondition;
  deliveryDate?: Date;
  messageTitle: string;
  messagePreview: string;
  recording?: TimeCapsuleRecordingData;
}

export interface TimeCapsuleStats {
  total: number;
  pending: number;
  delivered: number;
  scheduled_for_date: number;
  scheduled_on_death: number;
  failed: number;
}