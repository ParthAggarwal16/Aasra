import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CASES_DATA } from '../../data/professionalMockData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h3 className="text-3xl font-bold text-on-surface">Good afternoon</h3>
        <p className="text-lg text-on-surface-variant">Here's what needs your attention today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE CASES', value: '128', icon: 'folder_open', color: 'text-secondary' },
          { label: 'HIGH PRIORITY', value: '12', icon: 'warning', color: 'text-error', sub: '3 since yesterday', subIcon: 'arrow_upward' },
          { label: 'NEEDS FOLLOW-UP', value: '24', icon: 'schedule', color: 'text-tertiary', sub: '8 due today' },
          { label: 'IMPROVING', value: '67', icon: 'trending_up', color: 'text-secondary', sub: 'Positive trend' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant hover:bg-surface-container-low transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
              <span className={`material-symbols-outlined ${stat.color} opacity-70`}>{stat.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            {stat.sub && (
              <div className={`text-xs mt-1 flex items-center gap-1 ${stat.color}/80`}>
                {stat.subIcon && <span className="material-symbols-outlined text-xs">{stat.subIcon}</span>}
                {stat.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/50 bg-surface/50 flex justify-between items-center">
            <h4 className="text-xl font-bold text-on-surface">Cases Needing Attention</h4>
            <Link to="/cases" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">CASE</th>
                  <th className="p-4">RISK</th>
                  <th className="p-4">TREND</th>
                  <th className="p-4">LAST CHECK-IN</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {CASES_DATA.slice(0, 4).map(c => (
                  <tr key={c.id} className="border-b border-outline-variant/30 hover:bg-surface-container-lowest/80 transition-colors">
                    <td className="p-4 font-semibold">Anonymous #{c.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.priority === 'High' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                        {c.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className={`p-4 flex items-center gap-1 ${c.trend === 'Increasing' ? 'text-error' : 'text-secondary'}`}>
                      <span className="material-symbols-outlined text-sm">{c.trend === 'Increasing' ? 'trending_up' : 'trending_down'}</span> {c.trend}
                    </td>
                    <td className="p-4 text-on-surface-variant">{c.checkIn}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => navigate(`/cases/${c.id}`)} className="px-4 py-2 bg-secondary text-on-secondary rounded-full text-xs font-bold hover:bg-secondary/90 transition-colors">
                        View Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col h-64">
            <div className="mb-4">
              <h4 className="text-lg font-bold text-on-surface">Distress Trend</h4>
              <p className="text-xs text-on-surface-variant">Based on recent check-ins.</p>
            </div>
            <div className="flex-1 bg-surface-container-low rounded border border-outline-variant/30 flex items-end p-2 gap-2 relative">
              <div className="flex-1 bg-secondary/20 h-[30%] rounded-t"></div>
              <div className="flex-1 bg-secondary/30 h-[45%] rounded-t"></div>
              <div className="flex-1 bg-secondary/40 h-[40%] rounded-t"></div>
              <div className="flex-1 bg-tertiary/40 h-[60%] rounded-t"></div>
              <div className="flex-1 bg-error/30 h-[75%] rounded-t relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-error">Peak</div>
              </div>
              <div className="flex-1 bg-error/50 h-[90%] rounded-t"></div>
              <div className="flex-1 bg-error/60 h-[85%] rounded-t"></div>
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant mt-2 px-2 uppercase tracking-tighter">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col gap-4">
            <h4 className="text-lg font-bold text-on-surface">Early Warning Signals</h4>
            <div className="p-3 border border-error-container bg-error-container/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-xs font-bold text-error uppercase">Increasing distress</span>
              </div>
              <p className="text-xs text-on-surface mb-3">Several users show repeated high-distress check-ins.</p>
              <button onClick={() => navigate('/cases')} className="text-error text-xs font-bold flex items-center gap-1 hover:underline">
                View Cases <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-container flex items-center gap-3 p-4 rounded-lg border border-outline-variant mt-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-sm text-on-surface-variant">AI highlights patterns. Support professionals make the final decision.</p>
      </div>
    </div>
  );
};
