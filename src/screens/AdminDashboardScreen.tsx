/**
 * ================================================================================
 * File: src/screens/AdminDashboardScreen.tsx
 * Description: Professional & Admin Case Monitoring Dashboard.
 * Displays real-time distress trajectory, high-risk victim alerts, active triage
 * cases, and quick intervention dispatch actions.
 * ================================================================================
 */

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Activity, TrendingUp, ArrowRight, PhoneCall, CheckCircle, Clock, Eye } from 'lucide-react';
import { CASES_DATA, ALERTS_DATA } from '../utils/mockCasesData';
import { CaseItem } from '../types';

interface AdminDashboardScreenProps {
  onSelectCase: (caseId: string) => void;
  onNavigateToCases: () => void;
  onNavigateToAlerts: () => void;
  onSwitchToPatient: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onSelectCase,
  onNavigateToCases,
  onNavigateToAlerts,
  onSwitchToPatient,
}) => {
  const [cases, setCases] = useState<CaseItem[]>(CASES_DATA);
  const [liveHistory, setLiveHistory] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live case profile data from backend
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.history) {
          setLiveHistory(data.history);
        }
      })
      .catch((err) => console.error('Error fetching live profile:', err));
  }, []);

  const latestLiveDDS = liveHistory.length > 0 ? liveHistory[liveHistory.length - 1].dds : 78;

  return (
    <div className="flex flex-col px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner with Portal Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
              Live Counselor Triage
            </span>
            <span className="text-xs text-slate-400">Section 15A SC/ST PoA Act Protected</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            AASRA Professional Decision-Support Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Monitor victim well-being trajectories, distress spikes, and intervention triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={onSwitchToPatient}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Users size={16} />
          <span>Switch to Patient View</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Cases</span>
            <Users size={20} className="text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">128</div>
          <p className="text-xs text-slate-500 mt-1">32 monitored this week</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Risk</span>
            <AlertTriangle size={20} className="text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-600">12</div>
          <p className="text-xs text-rose-600 font-medium mt-1">3 new distress spikes</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-ups Due</span>
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">24</div>
          <p className="text-xs text-slate-500 mt-1">8 scheduled today</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Case DDS</span>
            <Activity size={20} className="text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">{latestLiveDDS} / 100</div>
          <p className="text-xs text-emerald-700 font-medium mt-1">Real-time LLM Distress Score</p>
        </div>
      </div>

      {/* Main Grid: Cases Needing Attention + Real-Time Distress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Cases Needing Clinical Attention</h3>
              <p className="text-xs text-slate-500">Ranked by Dynamic Distress Score (DDS) & risk trajectory</p>
            </div>
            <button
              type="button"
              onClick={onNavigateToCases}
              className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4">DDS Score</th>
                  <th className="py-3 px-4">Last Check-in</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Anonymous #{c.id}
                      <span className="block text-[11px] text-slate-400 font-normal">{c.followUp}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          c.priority === 'High'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.distressScore || 65} / 100
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{c.checkIn}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectCase(c.id)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Distress Alerts (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-slate-900">Live Distress Alerts</h3>
              <button
                type="button"
                onClick={onNavigateToAlerts}
                className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
              >
                All Alerts
              </button>
            </div>

            <div className="space-y-3">
              {ALERTS_DATA.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border border-slate-200 border-l-4 ${alert.color} text-xs space-y-1`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{alert.case}</span>
                    <span className="text-slate-400 font-normal text-[10px]">{alert.time}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-emerald-50/60 p-3 rounded-2xl">
            <p className="text-xs text-emerald-900 font-medium">
              💡 <strong>Trauma-Informed Note</strong>: Distress scores are computed exclusively on the server to prevent user self-stigmatization and demotivation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
