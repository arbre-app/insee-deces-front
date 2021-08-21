import { ERROR, LOADING, SUCCESS } from './actions';

export const initialState = {
  loading: false,
  query: null,
  data: null,
  error: null,
};

export const placeReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: true,
        query: action.query,
        data: state.data,
        error: null,
      };
    case SUCCESS:
      return {
        loading: false,
        query: state.query,
        data: action.data,
        error: null,
      };
    case ERROR:
      return {
        loading: false,
        query: state.query,
        data: null,
        error: state.error,
      };
  }
};
