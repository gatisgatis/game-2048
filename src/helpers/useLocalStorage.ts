import { useState } from 'react';

const getSavedValue = <T>(key: string, initialValue: T) => {
  const valueFromLocalStorage = localStorage.getItem(key);
  if (valueFromLocalStorage) return JSON.parse(valueFromLocalStorage);
  return initialValue;
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState(getSavedValue(key, initialValue));
  
  const setValue = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setStoredValue(value);
  };

  return [storedValue, setValue];
};
