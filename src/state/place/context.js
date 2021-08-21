import { createContext, useContext } from 'react';
import { useAppReducer } from '../../hooks';
import { initialState, placeReducer } from './reducer';

const PlaceContext = createContext();

export function PlaceProvider({ children }) {
  const [state, dispatch] = useAppReducer(placeReducer, initialState);
  const value = { state, dispatch };
  return <PlaceContext.Provider value={value}>{children}</PlaceContext.Provider>;
}

export const usePlaceContext = () => useContext(PlaceContext);
