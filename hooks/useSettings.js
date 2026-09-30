import { useSyncExternalStore } from 'react';

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

const listeners = new Set();
let cachedSettingsJson;
let cachedSettings;

export default function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    getSettings,
    getServerSettings
  );
  return { settings, setSetting };
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getSettings() {
  const settingsJson = localStorage.getItem('settings');
  if (settingsJson === cachedSettingsJson) {
    return cachedSettings;
  }
  cachedSettingsJson = settingsJson;
  cachedSettings = {
    ...defaultSettings,
    showKeypad: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    ...JSON.parse(settingsJson)
  };
  return cachedSettings;
}

function getServerSettings() {
  return defaultSettings;
}

function setSetting(key, value) {
  localStorage.setItem(
    'settings',
    JSON.stringify({ ...getSettings(), [key]: value })
  );
  listeners.forEach((listener) => listener());
}
