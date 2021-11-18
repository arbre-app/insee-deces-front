import { createContext, useContext } from 'react';
import { useAppReducer } from '../../hooks';
import { initialState, gedcomReducer } from './reducer';

const GedcomContext = createContext();

export function GedcomProvider({ children }) {
  const [state, dispatch] = useAppReducer(gedcomReducer, initialState);
  const value = { state, dispatch };
  return <GedcomContext.Provider value={value}>{children}</GedcomContext.Provider>;
}

export const useGedcomContext = () => useContext(GedcomContext);
