/**
 * ================================================================================
 * File: src/types.ts
 * Description: TypeScript domain definitions, interfaces, and shared state types
 * across the AASRA application (ScreenType, TabType, MoodType, CommunityPost, UserSettings, Admin types).
 * ================================================================================
 */

export type ScreenType =
  | 'welcome'
  | 'phone_login'
  | 'consent'
  | 'home'
  | 'help_hub'
  | 'activity'
  | 'activity_meditation'
  | 'companion_connect'
  | 'emergency_call'
  | 'offline_mode'
  | 'community'
  | 'story_detail'
  | 'create_post'
  | 'success'
  | 'privacy_settings'
  | 'admin_dashboard'
  | 'admin_cases'
  | 'admin_case_detail'
  | 'admin_alerts'
  | 'admin_intervention'
  | 'admin_followups';

export type TabType = 'home' | 'help' | 'activity' | 'community' | 'call';

export type AppMode = 'patient' | 'admin';

export type BrandName = 'AASRA' | 'Saathi';

export type MoodType = 'very_good' | 'good' | 'okay' | 'not_good';

export interface CommunityPost {
  id: string;
  author: string;
  avatarText?: string;
  content: string;
  englishTranslation?: string;
  supportCount: number;
  isSupported: boolean;
  timestamp: string;
  isStory?: boolean;
}

export interface UserSettings {
  phoneNumber: string;
  isLoggedIn: boolean;
  hasConsented: boolean;
  checkinCallsEnabled: boolean;
  communityShareEnabled: boolean;
  brandName: BrandName;
  language: 'hinglish' | 'hindi' | 'english';
  isOffline: boolean;
  currentMood?: MoodType;
  lastMoodTimestamp?: string;
}

export interface CaseItem {
  id: string;
  initial: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  trend: 'Increasing' | 'Stable' | 'Improving' | string;
  checkIn: string;
  engagement: string;
  followUp: string;
  distressScore?: number;
  lastTranscript?: string;
}

export interface AlertItem {
  case: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  time: string;
  title: string;
  desc: string;
  color: string;
}

export interface ScheduledFollowUp {
  caseId: string;
  type: string;
  schedule: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: string;
  actionType: 'view' | 'resolve';
}
