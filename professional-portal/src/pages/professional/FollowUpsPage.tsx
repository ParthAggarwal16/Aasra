import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const FollowUpsPage: React.FC = () => {
  const [resolved, setResolved] = useState<{ [key: string]: boolean }>({});

  const handleResolve = (caseId: string) => {
    setResolved(prev => ({ ...prev, [caseId]: true }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Follow-ups</h2>
        <p className="text-lg text-on-surface-variant">Manage scheduled support interactions and actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Due Today</h3>
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              event_available
            </span>
          </div>
          <div className="text-4xl font-bold">8</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Upcoming</h3>
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
              calendar_month
            </span>
          </div>
          <div className="text-4xl font-bold">16</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Overdue</h3>
            <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">
              warning
            </span>
          </div>
          <div className="text-4xl font-bold text-error">3</div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-low border-b border-outline-variant">
          <h3 className="text-lg font-bold">Scheduled Follow-ups</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-surface-container text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/50">
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-4 font-bold">Anonymous #K29</td>
                <td className="p-4 text-on-surface-variant">Human support call</td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm">schedule</span> Today · 4:30 PM
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                    HIGH
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    Due today
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    to="/cases/K29"
                    className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold"
                  >
                    View Case
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-4 font-bold">Anonymous #M17</td>
                <td className="p-4 text-on-surface-variant">Check-in follow-up</td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-error">
                    <span className="material-symbols-outlined text-sm">history</span> Yesterday · 5:20 PM
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    MEDIUM
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      resolved['M17']
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {resolved['M17'] ? 'Resolved' : 'Overdue'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {resolved['M17'] ? (
                    <span className="text-xs font-bold text-secondary">Completed</span>
                  ) : (
                    <button
                      onClick={() => handleResolve('M17')}
                      className="px-4 py-2 bg-surface text-primary border border-primary rounded-full text-xs font-bold hover:bg-surface-container-low transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
