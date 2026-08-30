import React, { useState } from 'react';

interface PhoneLoginScreenProps {
  onNavigateToOTP: (phoneNumber: string) => void;
  onNavigateToVoice?: () => void;
  onBack?: () => void;
}

export const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({
  onNavigateToOTP,
  onNavigateToVoice,
  onBack,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length === 10) {
      onNavigateToOTP(phoneNumber);
    } else {
      // Default to demo number if empty, or require input
      onNavigateToOTP(phoneNumber || '9876543432');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col items-center justify-start pb-safe relative">
      {/* TopAppBar Container (Mobile First, Max Width 440px) */}
      <header className="fixed top-0 w-full z-50 bg-surface dark:bg-surface-dim shadow-sm flex justify-between items-center px-gutter h-touch-target-min max-w-[440px] mx-auto transition-colors duration-200 ease-in-out">
        <button
          aria-label="Go Back"
          onClick={onBack}
          type="button"
          className="h-touch-target-min w-touch-target-min flex items-center justify-start text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-high rounded-full transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            arrow_back
          </span>
        </button>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary dark:text-primary-fixed-dim absolute left-1/2 -translate-x-1/2">
          AASRA
        </h1>
        <button
          type="button"
          onClick={onNavigateToVoice}
          className="h-[40px] px-4 rounded-full bg-surface-container-lowest shadow-sm outline-variant border neomorphic-button text-secondary font-label-caps flex items-center justify-center gap-2"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            graphic_eq
          </span>
          Suniye
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[440px] mx-auto pt-[80px] px-gutter flex flex-col flex-grow relative pb-[100px]">
        {/* Decorative Header / Greeting Area */}
        <div className="flex flex-col items-center justify-center mt-8 mb-stack-gap text-center relative">
          <div className="w-24 h-24 rounded-full mb-4 overflow-hidden neomorphic-card bg-surface-container-lowest border border-outline-variant flex items-center justify-center z-10 relative">
            <img
              alt="Companion Avatar"
              className="w-full h-full object-cover rounded-full"
              data-alt="A warm, compassionate 3D rendering of a South Asian female companion avatar, soft features, wearing traditional yet modern earthy-toned clothing. Gentle lighting, soft pastel background, approachable and trustworthy. High key lighting, soft neomorphic aesthetic, digital art."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEozoSCz9ImQows3QjnIBXAkxcLKRFgsAZPtV_FWAPTtYh7FA0mP3eEyEuIbzLvwkU1gpBR3qNKUaLXwaHH_zA9B0rw8Sv_ukeVodTPEZSg9NapvFx13VG8GXLjPscmSIh7faxyK_88dJEZtriaSYuMeBY7imY-qrMsvYV8FxukzwMtCzOKtgEcSQ6pv0a9-Bh8Nel0Z44Fm4g2A0RQdE7qIA9AqBinqNg9wEm8AHWL1dqJ031lW0QbA"
            />
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">
            Namaste 👋
          </h2>
          <p className="font-hindi-body text-hindi-body text-on-surface-variant max-w-[280px]">
            Apna mobile number enter karein.
          </p>
        </div>

        {/* Interactive Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-xl p-container-padding neomorphic-card border border-outline-variant w-full mt-4 flex flex-col gap-6"
        >
          {/* Phone Input Component */}
          <div className="flex flex-col gap-2">
            <label className="sr-only" htmlFor="phone-input">
              Phone Number
            </label>
            <div
              className={`flex items-center bg-surface-container rounded-lg border ${
                phoneNumber.length === 10 ? 'border-secondary' : 'border-outline-variant'
              } h-touch-target-min px-4 input-ring transition-all`}
            >
              <span className="font-body-lg text-body-lg text-on-surface-variant border-r border-outline-variant pr-3 mr-3 select-none">
                +91
              </span>
              <input
                id="phone-input"
                aria-label="Enter mobile number"
                className="bg-transparent border-none outline-none flex-grow font-body-lg text-body-lg text-on-surface placeholder:text-surface-dim/60 placeholder:tracking-widest focus:ring-0"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]*"
                placeholder="__________"
                type="tel"
                value={phoneNumber}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
            <p className="font-body-md text-[14px] text-on-surface-variant mt-2 text-center">
              Hum aapke number par ek OTP bhejenge.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full h-touch-target-min bg-secondary text-on-secondary font-headline-md text-headline-md rounded-full shadow-sm hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            OTP Bhejein
            <span className="material-symbols-outlined text-[24px]">
              arrow_forward
            </span>
          </button>
        </form>
      </main>
    </div>
  );
};
