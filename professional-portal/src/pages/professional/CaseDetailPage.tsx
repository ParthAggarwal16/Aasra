import React from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { CASES_DATA } from '../../data/professionalMockData';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const caseId = (id || location.pathname.split('/').pop() || '').toUpperCase();
  const currentCase = CASES_DATA.find(c => c.id.toUpperCase() === caseId) || CASES_DATA[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          to="/cases"
          className="text-secondary hover:bg-surface-container-low rounded-full p-2 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Case #{currentCase.id}</h2>
          <p className="text-sm text-on-surface-variant">Anonymous support case · Last updated: Today, 2:15 PM</p>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
        <h2 className="text-3xl font-bold text-primary mb-6">ANONYMOUS #{currentCase.id}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
          {[
            {
              label: 'Support Priority',
              value: currentCase.priority,
              color: currentCase.priority === 'High' ? 'text-error' : 'text-primary',
            },
            {
              label: 'Distress Trend',
              value: currentCase.trend,
              color: 'text-primary',
              icon: 'trending_up',
            },
            {
              label: 'Last Check-in',
              value: currentCase.checkIn,
              color: 'text-on-surface',
            },
            {
              label: 'Engagement',
              value: currentCase.engagement,
              color: 'text-on-surface-variant',
            },
            {
              label: 'Follow-up',
              value: currentCase.followUp,
              color: 'text-primary',
            },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </span>
              <div className={`flex items-center gap-2 font-bold ${stat.color}`}>
                {stat.icon && <span className="material-symbols-outlined text-sm">{stat.icon}</span>}
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
            <h3 className="text-xl font-bold text-on-surface mb-6">Distress Trajectory</h3>
            <div className="h-48 bg-surface-container-low rounded-lg border border-outline-variant/30 mb-4 p-4 relative overflow-hidden flex items-end">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M 5,80 L 19,75 L 34,80 L 48,55 L 63,50 L 77,25 L 92,10"
                  fill="none"
                  stroke="#782c00"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
            <div className="bg-error-container/30 p-4 rounded-lg border border-error-container flex gap-3">
              <span className="material-symbols-outlined text-error">info</span>
              <p className="text-sm">Distress signals have increased across recent check-ins.</p>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
            <h3 className="text-xl font-bold text-on-surface mb-6">Recent Check-ins</h3>
            <div className="space-y-4">
              {[
                { time: 'Today', level: 'High Distress', quote: '"Very difficult"', color: 'bg-error' },
                { time: 'Yesterday', level: 'High Distress', quote: '"Not feeling good"', color: 'bg-error' },
                { time: '2 days ago', level: 'Medium Distress', quote: '"Having a difficult day"', color: 'bg-primary' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 pb-4 border-l-2 border-outline-variant/30 last:border-l-0"
                >
                  <div
                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${item.color} border-2 border-white`}
                  ></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">{item.time}</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-bold">
                      {item.level}
                    </span>
                  </div>
                  <p className="text-sm italic text-on-surface bg-surface-container p-3 rounded-lg">
                    {item.quote}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-error/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-error">flag</span>
              <h3 className="text-lg font-bold">Flagged Indicators</h3>
            </div>
            <ul className="space-y-4">
              {[
                { title: 'REPEATED HIGH-DISTRESS', desc: 'Recorded repeatedly over last 3 check-ins.' },
                { title: 'INCREASING TREND', desc: 'Distress signals show an upward pattern.' },
                { title: 'REDUCED ENGAGEMENT', desc: 'Recent activity has decreased.' },
              ].map((note, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-error-container text-error flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">{note.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-tight">{note.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-tertiary-fixed/30 rounded-xl p-6 shadow-sm border border-tertiary-fixed-dim/50">
            <span className="text-[10px] font-bold text-tertiary-container uppercase mb-1 block">
              Recommended step
            </span>
            <h3 className="text-xl font-bold mb-2">Human follow-up</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Consider contacting this user to understand their situation.
            </p>
            <button
              onClick={() => navigate(`/intervention/${currentCase.id}`)}
              className="w-full py-3 bg-secondary text-on-secondary rounded-full text-sm font-bold flex justify-center items-center gap-2"
            >
              Review Intervention <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
