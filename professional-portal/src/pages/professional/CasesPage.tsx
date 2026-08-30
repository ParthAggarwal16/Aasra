import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASES_DATA } from '../../data/professionalMockData';

export const CasesPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (filter === 'All') return CASES_DATA;
    return CASES_DATA.filter(c => c.priority === filter);
  }, [filter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-on-surface">Cases</h2>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Review support cases and identify those that may need attention.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            {f === 'All' ? 'All Cases' : `${f} Priority`}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="p-4">CASE</th>
                <th className="p-4">PRIORITY</th>
                <th className="p-4">DISTRESS TREND</th>
                <th className="p-4">LAST CHECK-IN</th>
                <th className="p-4">ENGAGEMENT</th>
                <th className="p-4">FOLLOW-UP</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/50">
              {filteredData.map(c => (
                <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                        {c.initial}
                      </div>
                      <span className="font-semibold">Anonymous #{c.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        c.priority === 'High'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.priority === 'High' ? 'bg-error' : 'bg-tertiary'
                        }`}
                      ></span>
                      {c.priority}
                    </span>
                  </td>
                  <td
                    className={`p-4 flex items-center gap-1 ${
                      c.trend === 'Increasing' ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {c.trend === 'Increasing' ? 'trending_up' : 'trending_down'}
                    </span>{' '}
                    {c.trend}
                  </td>
                  <td className="p-4 text-on-surface-variant">{c.checkIn}</td>
                  <td className="p-4">{c.engagement}</td>
                  <td
                    className={`p-4 font-bold ${
                      c.followUp === 'Needed' ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {c.followUp}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="px-4 py-2 bg-secondary text-on-secondary rounded-full text-xs font-bold hover:bg-on-secondary-container transition-colors shadow-sm"
                    >
                      View Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant bg-surface-container flex justify-between items-center text-xs font-semibold text-on-surface-variant">
          <span>
            Showing 1–{filteredData.length} of {filteredData.length} cases
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded opacity-50" aria-label="Previous Page">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
              1
            </button>
            <button className="p-1 rounded opacity-50" aria-label="Next Page">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
