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
  | 'privacy_settings';

export type TabType = 'home' | 'help' | 'activity' | 'community' | 'call';

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
