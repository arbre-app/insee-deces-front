import thunk from 'redux-thunk';
import { useMiddlewareReducer } from './middleware';

const middlewares = [thunk];

export const useAppReducer = (reducer, initialState) => useMiddlewareReducer(
  middlewares,
  reducer,
  initialState
);
