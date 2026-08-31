/**
 * ================================================================================
 * File: src/App.tsx
 * Description: Root React Application Component for the AASRA Platform.
 * Manages global screen routing (Home, Help Hub, Activity, Community, Emergency,
 * Admin Dashboard), persistent user settings, active tab state, voice companion calls,
 * and the global floating AI Saathi support chatbot.
 * ================================================================================
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { PhoneLoginScreen } from './screens/PhoneLoginScreen';
import { ConsentScreen } from './screens/ConsentScreen';
import { HomeScreen } from './screens/HomeScreen';
import { HelpHubScreen } from './screens/HelpHubScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { CompanionConnectScreen } from './screens/CompanionConnectScreen';
import { EmergencyCallScreen } from './screens/EmergencyCallScreen';
import { OfflineModeScreen } from './screens/OfflineModeScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { StoryDetailScreen } from './screens/StoryDetailScreen';
import { CreatePostScreen } from './screens/CreatePostScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { PrivacySettingsScreen } from './screens/PrivacySettingsScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminCaseDetailScreen } from './screens/AdminCaseDetailScreen';
import { CompanionCallModal } from './components/CompanionCallModal';
import { ChatBotModal } from './components/ChatBotModal';
import { Bot, Sparkles } from 'lucide-react';
import { ScreenType, TabType, BrandName, MoodType, CommunityPost, UserSettings } from './types';
import { stopSpeaking } from './utils/speech';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 text-left">
            <h2 className="font-serif text-xl font-bold text-slate-900">AASRA Platform Diagnostic</h2>
            <p className="text-xs text-rose-600 font-mono bg-rose-50 p-3 rounded-xl border border-rose-200 break-all">
              {this.state.error?.message || 'Unknown render error'}
            </p>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-2xl cursor-pointer"
            >
              Reset All LocalStorage & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: 'Ek Saathi',
    content:
      'Aaj mujhe thoda behtar laga. Subah uth kar saans lena aasan tha, aur bahaar ki dhoop dekh kar ek nayi ummeed jaagi. Kal ka din mushkil tha, par aaj achha hai.',
    englishTranslation:
      'Today I felt a little better. Breathing in the morning was easier, and seeing the sun outside sparked a new hope.',
    supportCount: 14,
    isSupported: false,
    timestamp: 'Aaj (Today)',
  },
  {
    id: '2',
    author: 'Ek Saathi',
    content:
      'Sab theek ho jayega. Mujhe bhi ek waqt laga tha ki rasta nahi bacha hai, par dheere dheere sab sulajh gaya. Bas thoda sabar rakhna zaroori hai.',
    englishTranslation:
      'Everything will be okay. There was a time I thought there was no way out, but slowly everything resolved.',
    supportCount: 28,
    isSupported: true,
    timestamp: 'Kal (Yesterday)',
  },
  {
    id: '3',
    author: 'Ek Saathi',
    isStory: true,
    content:
      'Jab maine pehli baar is seva ka upyog kiya, mujhe bahut ghabrahat thi. Main akeli thi... Aaj main aatma-nirbhar hoon aur apni choti si dukan chala rahi hoon.',
    supportCount: 48,
    isSupported: false,
    timestamp: '2 din pehle',
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  phoneNumber: '98765 43210',
  isLoggedIn: true,
  hasConsented: true,
  checkinCallsEnabled: true,
  communityShareEnabled: false,
  brandName: 'AASRA',
  language: 'hinglish',
  isOffline: false,
};

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('aasra_user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('aasra_community_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_POSTS;
  });

  // Call & Chat modal states
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeCallDetails, setActiveCallDetails] = useState({
    name: 'AASRA Saathi Companion',
    number: '1800-123-456',
  });

  // Counselor / Admin View State
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('aasra_user_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aasra_community_posts', JSON.stringify(posts));
  }, [posts]);

  // Stop TTS speech when switching screens
  useEffect(() => {
    stopSpeaking();
  }, [currentScreen, activeTab]);

  // Tab change handler
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (settings.isOffline && tab === 'call') {
      setCurrentScreen('offline_mode');
    } else if (settings.isOffline) {
      setCurrentScreen('offline_mode');
    } else {
      switch (tab) {
        case 'home':
          setCurrentScreen('home');
          break;
        case 'help':
          setCurrentScreen('help_hub');
          break;
        case 'activity':
          setCurrentScreen('activity');
          break;
        case 'community':
          setCurrentScreen('community');
          break;
        case 'call':
          setCurrentScreen('emergency_call');
          break;
      }
    }
  };

  // Toggle Online/Offline
  const handleToggleOffline = () => {
    setSettings((prev) => {
      const nextOffline = !prev.isOffline;
      if (nextOffline) {
        setCurrentScreen('offline_mode');
      } else if (currentScreen === 'offline_mode') {
        setCurrentScreen('home');
      }
      return { ...prev, isOffline: nextOffline };
    });
  };

  // Screen narration mapping
  const getScreenNarrationText = (): string => {
    switch (currentScreen) {
      case 'welcome':
        return 'Namaste, hum aapke saath hain. Hello, we are with you.';
      case 'phone_login':
        return 'Apna number bharein. Hum aapko ek message bhejenge jisme verification code hoga.';
      case 'consent':
        return 'Hum aapki madad karna chahte hain. Hum aapka haal-chaal puchenge, aapki baatein safe rahengi.';
      case 'home':
        return 'Aaj aap kaisa mehsoos kar rahe hain? How are you feeling today?';
      case 'help_hub':
        return 'Hum aapki kya madad kar sakte hain? How can we help you today?';
      case 'activity':
      case 'activity_meditation':
        return 'Aaj ki choti koshish. 2 minute shaanti se baithein.';
      case 'companion_connect':
        return 'Kya aap kisi se baat karna chahte hain? Hamara ek saathi aapko call karega.';
      case 'emergency_call':
        return 'Turant madad chahiye? Hum hamesha aapke saath hain. Police 100, Mahila Helpline 1091, Ambulance 102.';
      case 'offline_mode':
        return 'Internet ki dikkat hai. Lekin chinta mat kariye, aap humein seedha call kar sakte hain.';
      case 'community':
        return 'Aap akele nahi hain. Yahan hum sab ek saath hain. Padhein aur mehsoos karein.';
      case 'story_detail':
        return 'Ek Saathi ki kahani. Prerna aur aasha ki kahani.';
      case 'create_post':
        return 'Apne mann ki baat kahein. Aapka naam kisi ko nahi dikhega.';
      case 'success':
        return 'Dhanyawad! Humne aapki baat sun li.';
      case 'privacy_settings':
        return 'Aapki Privacy hamare liye zaroori hai. Your privacy is important to us.';
      default:
        return 'AASRA Saathi - AI-Assisted Support & Risk Assessment';
    }
  };

  // Check if current screen is full-page onboarding
  const isOnboarding =
    currentScreen === 'welcome' ||
    currentScreen === 'phone_login' ||
    currentScreen === 'consent' ||
    currentScreen === 'success';

  const showHeaderBack =
    currentScreen === 'story_detail' ||
    currentScreen === 'create_post' ||
    currentScreen === 'privacy_settings' ||
    currentScreen === 'companion_connect';

  const handleBack = () => {
    if (currentScreen === 'story_detail' || currentScreen === 'create_post') {
      setCurrentScreen('community');
    } else if (currentScreen === 'companion_connect') {
      setCurrentScreen('help_hub');
    } else if (currentScreen === 'privacy_settings') {
      setCurrentScreen(activeTab === 'community' ? 'community' : 'home');
    } else {
      setCurrentScreen('home');
    }
  };

  // Direct Simulated Calls
  const handleInitiateCall = (number: string, serviceName: string) => {
    setActiveCallDetails({ name: serviceName, number });
    setIsCallModalOpen(true);
  };

  // Handle Post Creation
  const handleCreatePost = (content: string) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: 'Ek Saathi',
      content,
      supportCount: 1,
      isSupported: false,
      timestamp: 'Abhi (Just now)',
    };
    setPosts([newPost, ...posts]);
    setCurrentScreen('success');
  };

  // Handle Toggle Support on Post
  const handleToggleSupport = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextSupported = !p.isSupported;
          return {
            ...p,
            isSupported: nextSupported,
            supportCount: nextSupported ? p.supportCount + 1 : p.supportCount - 1,
          };
        }
        return p;
      })
    );
  };

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-slate-100/70 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6"
    >
      {/* Full Responsive Shell */}
      <div className="w-full max-w-5xl bg-white min-h-screen sm:min-h-[860px] sm:rounded-3xl shadow-xl border border-slate-200/80 flex flex-col justify-between overflow-hidden relative">
        {/* App Top Header Bar */}
        <Header
          brandName={settings?.brandName || 'AASRA'}
          screenTitleText={getScreenNarrationText()}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onProfileClick={() => setCurrentScreen('privacy_settings')}
          isOffline={settings?.isOffline || false}
          onToggleOffline={handleToggleOffline}
          showBack={showHeaderBack}
          onBack={handleBack}
          isAdminView={isAdminView}
          onToggleAdminView={() => {
            setIsAdminView(!isAdminView);
            setSelectedCaseId(null);
          }}
        />

        {/* Screen Content Router */}
        <main
          id="main-screen-content"
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-8"
        >
          {isAdminView ? (
            selectedCaseId ? (
              <AdminCaseDetailScreen
                caseId={selectedCaseId}
                onBack={() => setSelectedCaseId(null)}
              />
            ) : (
              <AdminDashboardScreen
                onSelectCase={(caseId) => setSelectedCaseId(caseId)}
                onNavigateToCases={() => setSelectedCaseId('1042')}
                onNavigateToAlerts={() => setSelectedCaseId('1089')}
                onSwitchToPatient={() => setIsAdminView(false)}
              />
            )
          ) : (
            <>
              {currentScreen === 'welcome' && (
                <WelcomeScreen
                  onContinue={() => setCurrentScreen('phone_login')}
                />
              )}

              {currentScreen === 'phone_login' && (
                <PhoneLoginScreen
                  initialPhone={settings.phoneNumber}
                  onSubmitPhone={(phone) => {
                    setSettings({ ...settings, phoneNumber: phone, isLoggedIn: true });
                    setCurrentScreen('consent');
                  }}
                />
              )}

              {currentScreen === 'consent' && (
                <ConsentScreen
                  onAccept={() => {
                    setSettings({ ...settings, hasConsented: true });
                    setCurrentScreen('home');
                    setActiveTab('home');
                  }}
                  onDecline={() => {
                    setCurrentScreen('home');
                    setActiveTab('home');
                  }}
                />
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  currentMood={settings.currentMood}
                  onSelectMood={(mood) => {
                    setSettings({ ...settings, currentMood: mood });
                  }}
                  onNavigateToHelp={() => {
                    setActiveTab('help');
                    setCurrentScreen('help_hub');
                  }}
                  onNavigateToActivity={() => {
                    setActiveTab('activity');
                    setCurrentScreen('activity');
                  }}
                  onNavigateToCommunity={() => {
                    setActiveTab('community');
                    setCurrentScreen('community');
                  }}
                  onNavigateToCall={() => {
                    setActiveTab('call');
                    setCurrentScreen('emergency_call');
                  }}
                />
              )}

              {currentScreen === 'help_hub' && (
                <HelpHubScreen
                  onTalkToSomeone={() => setCurrentScreen('companion_connect')}
                  onOpenChat={() => setIsChatModalOpen(true)}
                  onTryActivity={() => {
                    setActiveTab('activity');
                    setCurrentScreen('activity');
                  }}
                  onCommunitySupport={() => {
                    setActiveTab('community');
                    setCurrentScreen('community');
                  }}
                  onEmergencyHelp={() => {
                    setActiveTab('call');
                    setCurrentScreen('emergency_call');
                  }}
                />
              )}

              {currentScreen === 'activity' && (
                <ActivityScreen
                  onBack={() => {
                    setActiveTab('home');
                    setCurrentScreen('home');
                  }}
                />
              )}

              {currentScreen === 'companion_connect' && (
                <CompanionConnectScreen
                  brandName={settings.brandName}
                  onCallMeNow={() => {
                    handleInitiateCall('1800-123-456', `${settings.brandName} Companion Support`);
                  }}
                  onLater={() => {
                    setCurrentScreen('help_hub');
                  }}
                />
              )}

              {currentScreen === 'emergency_call' && (
                <EmergencyCallScreen
                  brandName={settings.brandName}
                  onDirectCall={handleInitiateCall}
                />
              )}

              {currentScreen === 'offline_mode' && (
                <OfflineModeScreen
                  brandName={settings.brandName}
                  onDirectCall={handleInitiateCall}
                />
              )}

              {currentScreen === 'community' && (
                <CommunityScreen
                  posts={posts}
                  onToggleSupport={handleToggleSupport}
                  onOpenStoryDetail={(post) => setCurrentScreen('story_detail')}
                  onCreatePost={() => setCurrentScreen('create_post')}
                />
              )}

              {currentScreen === 'story_detail' && (
                <StoryDetailScreen
                  onBack={() => setCurrentScreen('community')}
                />
              )}

              {currentScreen === 'create_post' && (
                <CreatePostScreen
                  onSubmitPost={handleCreatePost}
                  onCancel={() => setCurrentScreen('community')}
                />
              )}

              {currentScreen === 'success' && (
                <SuccessScreen
                  onGoHome={() => {
                    setActiveTab('home');
                    setCurrentScreen('home');
                  }}
                />
              )}

              {currentScreen === 'privacy_settings' && (
                <PrivacySettingsScreen
                  settings={settings}
                  onSaveSettings={(updated) => {
                    setSettings((prev) => ({ ...prev, ...updated }));
                  }}
                  onBack={handleBack}
                />
              )}
            </>
          )}
        </main>

        {/* Floating AI Chat Assistant Trigger Button (Patient Mode only) */}
        {!isAdminView && !isOnboarding && !settings?.isOffline && (
          <button
            id="btn-floating-ai-chat"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsChatModalOpen(true);
            }}
            className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[90] px-4 py-2.5 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white shadow-2xl shadow-emerald-900/30 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/60 backdrop-blur-sm hover:shadow-emerald-600/40"
            title="AI Saathi Chat Assistant"
            aria-label="Open AI Saathi Chat Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <span className="text-sm font-serif font-bold tracking-wide">AI Saathi</span>
            <Sparkles size={14} className="text-emerald-200 animate-pulse" />
          </button>
        )}

        {/* Persistent Bottom Navigation (Patient Mode only) */}
        {!isAdminView && !isOnboarding && (
          <BottomNav
            activeTab={activeTab}
            brandName={settings?.brandName || 'AASRA'}
            onTabChange={handleTabChange}
          />
        )}

        {/* Interactive Conversational Voice Companion Call Modal */}
        <CompanionCallModal
          isOpen={isCallModalOpen}
          brandName={settings?.brandName || 'AASRA'}
          serviceName={activeCallDetails.name}
          phoneNumber={activeCallDetails.number}
          onClose={() => setIsCallModalOpen(false)}
        />

        {/* Interactive Streaming AI Chatbot Modal */}
        <ChatBotModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          brandName={settings?.brandName || 'AASRA'}
          onOpenVoice={() => setIsCallModalOpen(true)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
