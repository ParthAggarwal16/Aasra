import React from 'react';

interface AuthSuccessScreenProps {
  onContinue: () => void;
  onNavigateToVoice?: () => void;
}

export const AuthSuccessScreen: React.FC<AuthSuccessScreenProps> = ({
  onContinue,
  onNavigateToVoice,
}) => {
  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased overflow-hidden flex flex-col items-center justify-center">
      {/* Mobile Container Wrapper */}
      <div className="mx-auto w-full max-w-[440px] h-screen relative flex flex-col bg-surface shadow-sm md:shadow-md">
        {/* TopAppBar (Semantic Shell JSON Execution) */}
        <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-touch-target-min max-w-[440px] mx-auto flex justify-between items-center px-gutter transition-colors duration-200 ease-in-out">
          {/* Empty div to balance flex spacing if leading icon is removed */}
          <div aria-hidden="true" className="w-12 h-12 flex items-center justify-center opacity-0 cursor-default" />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary flex-1 text-center truncate">
            AASRA
          </h1>
          <button
            type="button"
            onClick={onNavigateToVoice}
            aria-label="Listen action"
            className="w-auto h-10 px-4 rounded-full bg-surface-container-highest hover:bg-surface-variant transition-colors duration-200 flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.1)] active:shadow-inner"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[20px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volume_up
            </span>
            <span className="font-nav-label text-nav-label text-primary">Suniye</span>
          </button>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center px-container-padding pt-[80px] pb-safe z-10">
          {/* Success Animation / Icon Area */}
          <div className="mb-8 relative flex items-center justify-center w-32 h-32">
            {/* Decorative background pulse */}
            <div className="absolute inset-0 bg-secondary-container rounded-full success-pulse opacity-50" />
            {/* Foreground Icon Container */}
            <div className="relative z-10 w-24 h-24 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <span
                className="material-symbols-outlined text-[48px]"
                data-icon="check_circle"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>

          {/* Typography & Messaging */}
          <div className="text-center space-y-4 max-w-sm mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Verification complete ✓
            </h2>
            <p className="font-hindi-body text-hindi-body text-on-surface-variant">
              Ab aap Aasra use kar sakte hain.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onContinue}
            className="w-full h-touch-target-min bg-secondary text-on-secondary font-headline-md text-[20px] rounded-full shadow-sm hover:bg-on-secondary-container transition-colors duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Aage Badhein
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </button>
        </main>
      </div>
    </div>
  );
};
