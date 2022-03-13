import { createContext, useEffect, useState } from 'react';

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

  const setSetting = (key, value) => {
    setSettings((settings) => ({ ...settings, [key]: value }));
  };

  // Load settings.
  useEffect(() => {
    const showKeypad = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const localStorageSettings = localStorage.getItem('settings');
    if (localStorageSettings === null) {
      setSetting('showKeypad', showKeypad);
      return;
    }
    setSettings((settings) => ({
      ...settings,
      showKeypad,
      ...JSON.parse(localStorageSettings)
    }));
  }, []);

  // Save setting changes.
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext, SettingsProvider };
