import React, { useState, useEffect, useRef } from 'react';

interface OTPVerificationScreenProps {
  phoneNumber?: string;
  onVerifySuccess: () => void;
  onEditPhoneNumber: () => void;
  onNavigateToVoice?: () => void;
  onBack?: () => void;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  phoneNumber = '9876543432',
  onVerifySuccess,
  onEditPhoneNumber,
  onNavigateToVoice,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(true); // Preserved from Stitch design example
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format masked number e.g. +91 98XXX XX432
  const formattedNumber = React.useMemo(() => {
    const raw = phoneNumber.replace(/[^0-9]/g, '');
    if (raw.length === 10) {
      return `+91 ${raw.slice(0, 2)}XXX XX${raw.slice(-3)}`;
    }
    return '+91 98XXX XX432';
  }, [phoneNumber]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    // Support paste of entire OTP
    if (cleanValue.length > 1) {
      const pastedDigits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const singleDigit = cleanValue.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Auto advance focus
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifySuccess();
  };

  return (
    <div className="bg-surface text-on-surface h-full flex flex-col font-body-md relative overflow-x-hidden min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-touch-target-min flex justify-between items-center px-gutter mx-auto md:max-w-[440px] md:left-1/2 md:-translate-x-1/2 transition-colors duration-200 ease-in-out">
        <button
          aria-label="Go back"
          type="button"
          onClick={onBack || onEditPhoneNumber}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface"
        >
          <span className="material-symbols-outlined" data-icon="arrow_back">
            arrow_back
          </span>
        </button>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary flex-1 text-center font-extrabold tracking-tight">
          AASRA
        </h1>
        <button
          type="button"
          onClick={onNavigateToVoice}
          className="px-4 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-secondary font-label-caps text-label-caps border border-outline-variant neo-button transition-colors hover:text-secondary-fixed-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface"
        >
          Suniye
          <span
            className="material-symbols-outlined ml-2 text-xl"
            data-icon="volume_up"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            volume_up
          </span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[440px] mx-auto px-gutter pt-[80px] pb-[100px] flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Illustration / Ambient Graphic */}
          <div className="w-32 h-32 mb-8 rounded-full bg-surface-container-high flex items-center justify-center neo-button relative overflow-hidden">
            <span
              className="material-symbols-outlined text-5xl text-primary"
              data-icon="sms"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sms
            </span>
            {/* Soft pulse for 'waiting' state */}
            <div
              className="absolute inset-0 rounded-full border-2 border-primary opacity-20 animate-ping"
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* Contextual Messaging */}
          <div className="text-center mb-10 space-y-2 w-full">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
              OTP Verification
            </h2>
            <p className="font-hindi-body text-hindi-body text-on-surface-variant">
              Aapke number par OTP bheja gaya hai.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="font-label-caps text-label-caps text-primary-container bg-primary-fixed px-3 py-1 rounded-full tracking-widest">
                {formattedNumber}
              </span>
              <button
                type="button"
                onClick={onEditPhoneNumber}
                aria-label="Edit phone number"
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="edit">
                  edit
                </span>
              </button>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-8" id="otpForm">
            {/* 6 Box Input */}
            <div className="flex justify-between w-full gap-2 relative">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  aria-label={`Digit ${index + 1}`}
                  className="otp-input w-12 h-14 text-center font-headline-lg text-headline-lg bg-surface-container-lowest border-2 border-outline-variant rounded-lg text-on-surface focus:border-secondary focus:bg-surface transition-all"
                  maxLength={1}
                  pattern="\d*"
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            {/* Error State (Subtle non-frightening error state from Stitch design) */}
            {showError && (
              <div
                className="flex items-center space-x-2 text-error bg-error-container/50 px-4 py-2 rounded-lg w-full transition-opacity duration-300 opacity-100 cursor-pointer"
                id="errorState"
                onClick={() => setShowError(false)}
                title="Click to dismiss preview"
              >
                <span className="material-symbols-outlined text-error" data-icon="error">
                  error
                </span>
                <span className="font-hindi-body text-[16px] leading-[24px]">
                  OTP sahi nahi hai. Dobara try karein.
                </span>
              </div>
            )}

            {/* Resend Action */}
            <div className="flex flex-col items-center mt-4">
              <p className="font-body-md text-body-md text-on-surface-variant mb-2">
                OTP nahi mila?
              </p>
              <button
                type="button"
                id="resendBtn"
                disabled={!canResend}
                onClick={handleResend}
                className="text-secondary font-label-caps text-label-caps flex items-center hover:text-on-secondary-fixed-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined mr-1 text-sm" data-icon="refresh">
                  refresh
                </span>
                OTP dobara bhejein{' '}
                {!canResend && (
                  <span className="ml-2 font-normal text-on-surface-variant" id="timer">
                    ({`00:${timer.toString().padStart(2, '0')}`})
                  </span>
                )}
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full h-touch-target-min bg-secondary text-on-secondary rounded-full font-headline-md text-headline-md shadow-sm hover:bg-on-secondary-fixed-variant transition-colors mt-8 focus:outline-none focus:ring-4 focus:ring-secondary-container focus:ring-offset-2 focus:ring-offset-surface flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Verify Karein
              <span className="material-symbols-outlined" data-icon="check_circle">
                check_circle
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
