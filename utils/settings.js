import { createContext, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'settings';

const defaultSettings = {
  inputDirection: 'right to left',
  showTimerWhileSolving: false,
  showKeypad: true,
  reverseKeypad: false,
  keypadZeroPosition: 'zero first'
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
    const localStorageSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
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
