import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { INTERVENTION_ACTIONS } from '../../data/professionalMockData';

export const InterventionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const caseId = (id || location.pathname.split('/').pop() || '').toUpperCase();
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(0);
  const [timing, setTiming] = useState<string>('asap');
  const [note, setNote] = useState<string>('');

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8 pb-20">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-bold text-sm mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Case #{caseId}
        </button>
        <h2 className="text-3xl font-bold text-on-surface">Intervention & Follow-up</h2>
        <p className="text-on-surface-variant">Record your decision for anonymous case #{caseId}.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col gap-4">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">person</span>
          ANONYMOUS #{caseId}
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Support Priority</p>
            <div className="text-primary font-bold">HIGH</div>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Distress Trend</p>
            <div className="text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              Increasing
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Choose an Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTERVENTION_ACTIONS.map((action, idx) => {
            const isSelected = selectedActionIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedActionIndex(idx)}
                className={`rounded-xl p-4 cursor-pointer shadow-sm border-2 transition-all ${
                  isSelected
                    ? 'bg-primary-container/10 border-primary'
                    : 'bg-surface-container-lowest border-outline-variant hover:border-secondary'
                }`}
              >
                <div className="flex justify-between">
                  <span
                    className={`material-symbols-outlined text-3xl ${
                      isSelected ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {action.icon}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary fill-icon">
                      check_circle
                    </span>
                  )}
                </div>
                <h4 className="font-bold mt-2">{action.title}</h4>
                <p className="text-xs text-on-surface-variant">{action.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-primary-fixed-dim">
        <h3 className="text-xl font-bold text-primary mb-4 border-b border-outline-variant/30 pb-2">
          Support Call Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Timing</label>
            <div className="flex flex-col gap-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                  timing === 'asap'
                    ? 'border-secondary bg-surface-container-low'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  value="asap"
                  checked={timing === 'asap'}
                  onChange={() => setTiming('asap')}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="text-sm">As soon as possible</span>
              </label>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                  timing === 'custom'
                    ? 'border-secondary bg-surface-container-low'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  value="custom"
                  checked={timing === 'custom'}
                  onChange={() => setTiming('custom')}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="text-sm">Choose date & time</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Support Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-secondary focus:border-secondary"
              placeholder="Add observations or notes..."
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-xl flex justify-between items-center">
        <p className="text-xs text-on-surface-variant max-w-xs hidden md:block">
          Final decisions are made by trained humans.
        </p>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5"
          >
            Save for Later
          </button>
          <button
            onClick={() => {
              alert('Intervention confirmed');
              navigate('/cases');
            }}
            className="flex-1 px-8 py-3 rounded-full bg-primary text-on-primary font-bold flex justify-center items-center gap-2"
          >
            Confirm Action <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
