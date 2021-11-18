import { ERROR, LOADING, SUCCESS } from './actions';

export const initialState = {
  loading: false,
  filename: null,
  gedcom: null,
  data: null,
  error: null,
};

export const gedcomReducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: true,
        filename: action.filename,
        gedcom: null,
        data: null,
        error: null,
      };
    case SUCCESS:
      return {
        loading: false,
        filename: state.filename,
        gedcom: action.gedcom,
        data: action.data,
        error: null,
      };
    case ERROR:
      return {
        loading: false,
        filename: null,
        gedcom: null,
        data: null,
        error: state.error,
      };
  }
};
