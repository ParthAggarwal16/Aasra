/**
 * ================================================================================
 * File: src/components/chatbot/SupportEscalationCard.tsx
 * Description: Emergency Helpline & Professional Escalation Card Component.
 * Provides direct access to Tele-MANAS (14416) and Emergency (112) services.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Phone, ShieldAlert, HeartHandshake, CheckCircle2, PhoneCall } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-teal-50/90 via-emerald-50/70 to-white border border-teal-200/80 p-4 rounded-2xl shadow-xs w-full my-2 relative overflow-hidden">
      <div className="flex items-start gap-3 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs">
          <PhoneCall size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">
            {requestSent
              ? 'Aapki support request darj kar li gayi hai.'
              : 'Zaroorat padne par turant sahayata uplabdh hai.'}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Tele-MANAS: <strong>14416</strong> • Emergency ERSS: <strong>112</strong>
          </p>
        </div>
      </div>

      {!requestSent ? (
        <div className="flex items-center gap-2 mt-3">
          <a
            href="tel:14416"
            className="flex-1 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Phone size={13} />
            <span>Call Tele-MANAS</span>
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-medium transition-all"
          >
            Baad mein
          </button>
        </div>
      ) : (
        <div className="mt-2 text-left text-teal-700 font-semibold text-xs flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          <span>Request Registered — Hamari team aapse jald sampark karegi.</span>
        </div>
      )}
    </div>
  );
};
