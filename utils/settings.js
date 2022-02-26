import { createContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const defaultSettings = {
  operation: 'MULTIPLICATION',
  operandLengths: [1, 1],
  setProblemCount: 5,
  inputDirection: 'LEFT_TO_RIGHT',
  showProblemNumber: true,
  showTimer: true,
  timerDisplayTime: 'PROBLEM_TIME',
  showAbortButton: true,
  showKeypad: true,
  reverseKeypad: false,
  keypadZeroPosition: 'ZERO_LAST'
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSetting: (_key, _value) => {}
});

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const { data: session } = useSession();

  // Load settings.
  useEffect(() => {
    let showKeypad = localStorage.getItem('showKeypad');
    if (showKeypad === null) {
      showKeypad = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    } else {
      // The boolean value is saved as a string in localStorage.
      showKeypad = JSON.parse(showKeypad);
    }
    if (session) {
      (async () => {
        const response = await fetch(`/api/users/${session.user.id}/settings`);
        if (response.ok) {
          const databaseSettings = await response.json();
          delete databaseSettings.userId;
          setSettings({ ...databaseSettings, showKeypad });
        }
      })();
    } else {
      const localStorageSettings = localStorage.getItem('settings');
      if (localStorageSettings === null) {
        return;
      }
      setSettings({
        ...JSON.parse(localStorageSettings),
        showKeypad
      });
    }
  }, [session]);

  // Save setting changes.
  useEffect(() => {
    const settingsWithoutShowKeypad = { ...settings };
    delete settingsWithoutShowKeypad.showKeypad;
    if (session) {
      (async () => {
        await fetch(`/api/users/${session.user.id}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsWithoutShowKeypad)
        });
      })();
    }
    localStorage.setItem('settings', JSON.stringify(settingsWithoutShowKeypad));
    localStorage.setItem('showKeypad', settings.showKeypad);
  }, [settings, session]);

  const setSetting = (key, value) => {
    setSettings((settings) => ({ ...settings, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext, SettingsProvider };
