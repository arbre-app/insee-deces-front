// Heavily inspired by https://stackoverflow.com/a/61923286/4413709

import { useMemo, useRef, useState } from 'react';

const enhanceDispatch = ({ getState, stateDispatch }) => {
  return (...middlewares) => {
    let dispatch;
    const middlewareAPI = {
      getState,
      dispatch: action => dispatch(action)
    };
    dispatch = middlewares
      .map(m => m(middlewareAPI))
      .reduceRight((next, mw) => mw(next), stateDispatch);
    return dispatch;
  };
};

export const useMiddlewareReducer = (
  middlewares,
  reducer,
  initialState,
  initializer = s => s
) => {
  const [state, setState] = useState(initializer(initialState));
  const stateRef = useRef(state);
  const dispatch = useMemo(
    () =>
      enhanceDispatch({
        getState: () => stateRef.current,
        stateDispatch: action => {
          stateRef.current = reducer(stateRef.current, action);
          setState(stateRef.current);
          return action;
        }
      })(...middlewares),
    [middlewares, reducer]
  );
  return [state, dispatch];
};
