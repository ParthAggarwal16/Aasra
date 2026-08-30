import React, { useState } from 'react';

export const SettingsPage: React.FC = () => {
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({
    'High-priority alerts': true,
    'Follow-up reminders': true,
    'Daily summary': true,
  });

  const toggleSetting = (setting: string) => {
    setToggles(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-primary">Settings</h2>
        <p className="text-on-surface-variant">Manage your professional portal preferences.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
          <div className="flex items-center gap-4 mb-6 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-secondary text-3xl">badge</span>
            <h3 className="text-xl font-bold">Account</h3>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-bold">Role</p>
              <p className="text-sm text-on-surface-variant">Support Staff</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Staff ID</p>
              <p className="text-sm font-mono text-on-surface-variant">4892-B</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
          <div className="flex items-center gap-4 mb-6 border-b border-outline-variant pb-4">
            <span className="material-symbols-outlined text-secondary text-3xl">notifications_active</span>
            <h3 className="text-xl font-bold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {['High-priority alerts', 'Follow-up reminders', 'Daily summary'].map((setting, idx) => {
              const isOn = toggles[setting] ?? true;
              return (
                <div
                  key={idx}
                  onClick={() => toggleSetting(setting)}
                  className="flex justify-between items-center p-3 hover:bg-surface-container transition-colors rounded-lg cursor-pointer"
                >
                  <span className="font-bold">{setting}</span>
                  <div
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      isOn ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                        isOn ? 'right-1' : 'left-1'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-tertiary-fixed rounded-xl p-6 border border-outline-variant flex items-center gap-4">
          <span className="material-symbols-outlined text-tertiary">lock</span>
          <p className="text-sm font-semibold">
            Case information is displayed using anonymous IDs to ensure privacy.
          </p>
        </section>
      </div>
    </div>
  );
};
