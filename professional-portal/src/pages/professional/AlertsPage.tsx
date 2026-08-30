import React from 'react';
import { Link } from 'react-router-dom';
import { ALERTS_DATA } from '../../data/professionalMockData';

export const AlertsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Alerts</h2>
          <p className="text-on-surface-variant">Review important changes that may need your attention.</p>
        </div>
        <button className="px-6 py-2 bg-primary text-on-primary text-xs font-bold rounded-full shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">done_all</span> Mark all reviewed
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">NEW ALERTS</span>
          <div className="text-3xl font-bold text-secondary">8</div>
        </div>
        <div className="bg-error-container p-4 rounded-xl border border-outline-variant shadow-sm">
          <span className="text-[10px] font-bold text-on-error-container uppercase tracking-widest">HIGH PRIORITY</span>
          <div className="text-3xl font-bold text-error">3</div>
        </div>
        <div className="bg-tertiary-fixed p-4 rounded-xl border border-outline-variant shadow-sm">
          <span className="text-[10px] font-bold text-on-tertiary-fixed uppercase tracking-widest">NEEDS REVIEW</span>
          <div className="text-3xl font-bold text-tertiary">5</div>
        </div>
      </div>

      <div className="space-y-4">
        {ALERTS_DATA.map((alert, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:bg-surface-container-low transition-colors relative overflow-hidden flex flex-col md:flex-row justify-between gap-4"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${alert.color}`}></div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">Anonymous #{alert.case}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.priority === 'HIGH'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}
                >
                  {alert.priority}
                </span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> {alert.time}
                </span>
              </div>
              <h3 className="font-bold">{alert.title}</h3>
              <p className="text-sm text-on-surface-variant">{alert.desc}</p>
            </div>
            <div className="flex items-center">
              <Link
                to={`/cases/${alert.case}`}
                className="w-full md:w-auto px-6 py-2 bg-primary text-on-primary text-xs font-bold rounded-full shadow-sm text-center"
              >
                Review Case
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
