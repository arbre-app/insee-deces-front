import { createContext, useContext } from 'react';
import { useAppReducer } from '../../hooks';
import { initialState, formReducer } from './reducer';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [state, dispatch] = useAppReducer(formReducer, initialState);
  const value = { state, dispatch };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const useFormContext = () => useContext(FormContext);
