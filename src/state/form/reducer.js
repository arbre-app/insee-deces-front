import { LOADING, SUCCESS, ERROR, CLEAR_SEARCH } from './actions';

export const initialState = {
  loading: false,
  form: null,
  data: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: true,
        form: state.form,
        data: state.data,
        error: null,
      };
    case SUCCESS:
      return {
        loading: false,
        form: { ...state.form, ...action.form },
        data: action.data,
        error: null,
      };
    case ERROR:
      return {
        loading: false,
        form: state.form,
        data: null,
        error: action.error,
      };
    case CLEAR_SEARCH:
      return {
        ...initialState,
        form: {
          resultsPerPage: state.resultsPerPage, // Preserve this parameter
        },
      };
    default:
      return state;
  }
};
