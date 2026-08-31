/**
 * ================================================================================
 * File: src/screens/AdminCaseDetailScreen.tsx
 * Description: Detailed Victim Profile, Longitudinal Distress Trajectory,
 * Voice Utterance Transcripts, and Counselor Action Dispatch Screen.
 * ================================================================================
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, AlertTriangle, PhoneCall, CheckCircle, Activity, Heart, Clock, FileText } from 'lucide-react';
import { CaseItem } from '../types';
import { CASES_DATA } from '../utils/mockCasesData';

interface AdminCaseDetailScreenProps {
  caseId: string;
  onBack: () => void;
}

export const AdminCaseDetailScreen: React.FC<AdminCaseDetailScreenProps> = ({
  caseId,
  onBack,
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const matchedCase = CASES_DATA.find((c) => c.id === caseId) || CASES_DATA[0];

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading profile:', err);
        setLoading(false);
      });
  }, [caseId]);

  return (
    <div className="flex flex-col px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Bar with Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-teal-700 font-semibold text-sm sm:text-base hover:underline cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider border border-rose-200">
          High Risk Priority
        </span>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-800 font-bold text-xl shrink-0 font-serif">
            {matchedCase.initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Anonymous Case #{matchedCase.id}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                SC/ST PoA Act
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Current Stage: <strong>Special Court Trial Scheduled</strong> | Legal Aid: <strong>DLSA Counsel Assigned</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert(`Initiating Tele-MANAS Triage Dispatch for Case #${matchedCase.id}...`)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <PhoneCall size={15} />
            <span>Dispatch Tele-MANAS (14416)</span>
          </button>
        </div>
      </div>

      {/* Longitudinal Check-in History & Transcripts */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Longitudinal Check-in Sessions & Transcripts
          </h3>
          <p className="text-xs text-slate-500">
            Chronological log of voice check-ins, extracted distress scores, and clinical notes.
          </p>
        </div>

        <div className="space-y-3">
          {profile && profile.history ? (
            profile.history.map((sess: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2"
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sess.session_id}</span>
                    <span className="text-slate-400 font-normal">({sess.date})</span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px]">
                      {sess.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-slate-500">DDS Score:</span>
                    <span className={sess.dds > 75 ? 'text-rose-600' : 'text-emerald-700'}>
                      {sess.dds} / 100
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  "{sess.transcript}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">Loading case history...</div>
          )}
        </div>
      </div>
    </div>
  );
};
