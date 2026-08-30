/**
 * ================================================================================
 * File: src/screens/PhoneLoginScreen.tsx
 * Description: Step 1 Phone Authentication & Verification Screen.
 * Provides frictionless phone number input and OTP verification simulation.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';

interface PhoneLoginScreenProps {
  initialPhone?: string;
  onSubmitPhone: (phone: string) => void;
}

export const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({
  initialPhone = '',
  onSubmitPhone,
}) => {
  const [phone, setPhone] = useState(initialPhone || '98765 43210');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('1234');
  const [error, setError] = useState('');

  const speechText =
    'Apna mobile number bharein. Hum aapko ek message bhejenge jisme ek verification code hoga.';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Kripya 10 anko ka valid mobile number dalein.');
      return;
    }
    setError('');
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Kripya sahi OTP code dalein.');
      return;
    }
    onSubmitPhone(phone);
  };

  return (
    <div
      id="screen-phone-login"
      className="min-h-full flex flex-col justify-between px-6 py-10 max-w-md mx-auto"
    >
      <div className="flex-1 flex flex-col items-center text-center mt-6">
        {/* Top Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58] shadow-sm mb-8">
          <Smartphone size={38} className="stroke-[2.2]" />
        </div>

        {/* Heading */}
        <h1
          id="login-title"
          className="font-serif text-3xl sm:text-4xl font-bold text-[#1d1b19] tracking-tight mb-3"
        >
          {otpStep ? 'OTP Code Bharein' : 'Apna number bharein'}
        </h1>

        <p
          id="login-subtitle"
          className="text-lg sm:text-xl text-[#594238] font-normal leading-relaxed max-w-xs mb-8"
        >
          {otpStep
            ? `Humne +91 ${phone} par 4-digit code bheja hai.`
            : 'Hum aapko ek message bhejenge jisme ek code hoga.'}
        </p>

        {/* Speaker Button */}
        <div className="mb-6">
          <SpeakerButton
            id="login-speaker-btn"
            textToSpeak={speechText}
            size="md"
          />
        </div>

        {/* Input Form */}
        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="w-full max-w-sm mt-2">
            <div className="bg-[#ede7e2] p-4 rounded-2xl border border-[#ded9d4] focus-within:border-[#9e3d00] focus-within:ring-2 focus-within:ring-[#ffddb9] transition-all flex items-center gap-3">
              <span className="text-xl font-bold text-[#594238] font-serif border-r border-[#ded9d4] pr-3">
                +91
              </span>
              <input
                id="input-mobile-number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="00000 00000"
                className="w-full bg-transparent text-2xl font-serif font-bold text-[#1d1b19] placeholder:text-[#8c7166]/60 focus:outline-none tracking-wider"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-[#ba1a1a] mt-2 text-left px-2">
                {error}
              </p>
            )}

            <div className="w-full pt-8">
              <button
                id="btn-send-otp"
                type="submit"
                className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>OTP Bhejein</span>
                <ArrowRight size={22} className="stroke-[2.5]" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full max-w-sm mt-2">
            <div className="bg-[#ede7e2] p-4 rounded-2xl border border-[#ded9d4] focus-within:border-[#9e3d00] focus-within:ring-2 focus-within:ring-[#ffddb9] transition-all flex items-center justify-center">
              <input
                id="input-otp-code"
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="• • • •"
                className="w-full text-center bg-transparent text-3xl font-mono font-bold tracking-[0.5em] text-[#1d1b19] placeholder:text-[#8c7166]/60 focus:outline-none"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-[#ba1a1a] mt-2 text-center">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-[#594238] mt-4 px-1">
              <span>Code nahi mila?</span>
              <button
                type="button"
                onClick={() => setOtp('1234')}
                className="text-[#9e3d00] font-semibold hover:underline"
              >
                Dobara Bhejein
              </button>
            </div>

            <div className="w-full pt-8">
              <button
                id="btn-verify-otp"
                type="submit"
                className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Aage Badhein</span>
                <CheckCircle2 size={22} className="stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
