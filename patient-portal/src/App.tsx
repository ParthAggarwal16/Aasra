import React, { useState } from 'react';
import { ScreenType } from './types';
import { PhoneLoginScreen } from './screens/PhoneLogin/PhoneLoginScreen';
import { OTPVerificationScreen } from './screens/OTP/OTPVerificationScreen';
import { AuthSuccessScreen } from './screens/AuthSuccess/AuthSuccessScreen';
import { ChatbotScreen } from './screens/Chatbot/ChatbotScreen';
import { VoiceCompanionScreen } from './screens/VoiceCompanion/VoiceCompanionScreen';
import { ScreenSwitcher } from './components/ScreenSwitcher';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('phone-login');
  const [navigationHistory, setNavigationHistory] = useState<ScreenType[]>(['phone-login']);
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543432');

  const navigateTo = (nextScreen: ScreenType) => {
    setNavigationHistory((prev) => [...prev, nextScreen]);
    setCurrentScreen(nextScreen);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      // Default fallback
      if (currentScreen === 'otp') setCurrentScreen('phone-login');
      else if (currentScreen === 'auth-success') setCurrentScreen('otp');
      else if (currentScreen === 'voice-companion') setCurrentScreen('chatbot');
      else setCurrentScreen('phone-login');
    }
  };

  const handlePhoneSubmit = (enteredPhone: string) => {
    setPhoneNumber(enteredPhone);
    navigateTo('otp');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'phone-login':
        return (
          <PhoneLoginScreen
            onNavigateToOTP={handlePhoneSubmit}
            onNavigateToVoice={() => navigateTo('voice-companion')}
            onBack={() => {}}
          />
        );

      case 'otp':
        return (
          <OTPVerificationScreen
            phoneNumber={phoneNumber}
            onVerifySuccess={() => navigateTo('auth-success')}
            onEditPhoneNumber={() => navigateTo('phone-login')}
            onNavigateToVoice={() => navigateTo('voice-companion')}
            onBack={handleBack}
          />
        );

      case 'auth-success':
        return (
          <AuthSuccessScreen
            onContinue={() => navigateTo('chatbot')}
            onNavigateToVoice={() => navigateTo('voice-companion')}
          />
        );

      case 'chatbot':
        return (
          <ChatbotScreen
            onBack={handleBack}
            onNavigateToVoice={() => navigateTo('voice-companion')}
          />
        );

      case 'voice-companion':
        return (
          <VoiceCompanionScreen
            onBack={handleBack}
            onNavigateToChat={() => navigateTo('chatbot')}
          />
        );

      default:
        return (
          <PhoneLoginScreen
            onNavigateToOTP={handlePhoneSubmit}
            onNavigateToVoice={() => navigateTo('voice-companion')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {renderCurrentScreen()}
      {/* Dev helper to jump to any extracted screen */}
      <ScreenSwitcher
        currentScreen={currentScreen}
        onSelectScreen={(screen) => navigateTo(screen)}
      />
    </div>
  );
};

export default App;
