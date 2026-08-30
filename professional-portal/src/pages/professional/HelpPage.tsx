import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/professionalMockData';

export const HelpPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-primary">Help & Support</h2>
        <p className="text-on-surface-variant">Find answers about using the Aasra Professional Portal.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
        {FAQS_DATA.map((faq, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              className="w-full p-6 flex justify-between items-center text-left hover:bg-surface-container-low transition-colors"
            >
              <span className="font-bold">{faq.q}</span>
              <span
                className={`material-symbols-outlined transition-transform ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-6 text-on-surface-variant text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-tertiary-fixed rounded-xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-tertiary shadow-sm">
          <span className="material-symbols-outlined text-3xl fill-icon">support_agent</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-1">Need more help?</h3>
          <p className="text-sm text-on-tertiary-fixed-variant">
            Contact your Aasra administrator or designated support team.
          </p>
        </div>
        <button className="px-6 py-2 bg-white text-tertiary-container text-xs font-bold rounded-full shadow-sm">
          CONTACT SUPPORT
        </button>
      </div>
    </div>
  );
};
