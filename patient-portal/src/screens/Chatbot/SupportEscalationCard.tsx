import React, { useState } from 'react';

interface SupportEscalationCardProps {
  onRequestCall?: () => void;
  onSeeOptions?: () => void;
  onDismiss?: () => void;
}

export const SupportEscalationCard: React.FC<SupportEscalationCardProps> = ({
  onRequestCall,
  onSeeOptions,
  onDismiss,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleRequestCall = () => {
    setRequestSent(true);
    if (onRequestCall) onRequestCall();
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="bg-surface-container-lowest border border-secondary/20 p-5 rounded-xl shadow-sm w-[90%] mx-auto my-2 relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary flex-shrink-0">
          <span className="material-symbols-outlined" data-icon="support_agent">
            support_agent
          </span>
        </div>
        <p className="font-hindi-body text-[18px] text-on-surface font-semibold leading-tight">
          {requestSent
            ? 'Aapki call request accept ho gayi hai. Hum jald call karenge.'
            : 'Shayad kisi se baat karna helpful ho.'}
        </p>
      </div>
      {!requestSent ? (
        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={handleRequestCall}
            className="w-full h-touch-target-min bg-secondary text-on-secondary rounded-full font-body-md font-bold shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Request a Call
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSeeOptions}
              className="flex-1 h-[48px] bg-surface text-secondary border border-secondary rounded-full font-body-md hover:bg-surface-variant transition-colors active:scale-[0.98]"
            >
              See Options
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-1 h-[48px] bg-transparent text-on-surface-variant border border-outline-variant rounded-full font-body-md hover:bg-surface-container-high transition-colors active:scale-[0.98]"
            >
              Not Now
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-center text-secondary font-semibold text-sm">
          ✓ Request Registered
        </div>
      )}
    </div>
  );
};
