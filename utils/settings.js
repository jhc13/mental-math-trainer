import { createContext, useEffect, useState } from 'react';
import { SETTINGS_LOCAL_STORAGE_KEY } from 'utils/config';

const defaultSettings = {
  operation: 'multiplication',
  operandLengths: [2, 2],
  problemsPerSet: 5,
  inputDirection: 'right to left',
  showProblemNumber: true,
  showTimer: false,
  showAbortButton: true,
  showKeypad: true,
  reverseKeypad: false,
  keypadZeroPosition: 'zero last'
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSetting: (_key, _value) => {}
});

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  // Load the settings from local storage.
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setSettings((settings) => ({ ...settings, showKeypad: isTouchDevice }));
    const localStorageSettings = localStorage.getItem(
      SETTINGS_LOCAL_STORAGE_KEY
    );
    if (localStorageSettings === null) {
      return;
    }
    setSettings((settings) => ({
      ...settings,
      ...JSON.parse(localStorageSettings)
    }));
  }, []);
  // Update localStorage when the settings change.
  useEffect(() => {
    localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

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
