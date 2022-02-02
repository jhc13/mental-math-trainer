import { createContext, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'settings';

const defaultSettings = {
  theme: 'dark',
  alwaysShowKeypad: false
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSetting: (_key, _value) => {}
});

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  // Load the settings from local storage.
  useEffect(() => {
    const settings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (settings === null) {
      return;
    }
    setSettings(JSON.parse(settings));
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
      <div className={settings.theme === 'dark' ? 'dark' : undefined}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export { SettingsContext, SettingsProvider };
