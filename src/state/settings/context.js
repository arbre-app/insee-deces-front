import { createContext, useContext } from 'react';
import { useAppReducer } from '../../hooks';
import { initialState, settingsReducer } from './reducer';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [state, dispatch] = useAppReducer(settingsReducer, initialState);
  const value = { state, dispatch };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettingsContext = () => useContext(SettingsContext);
