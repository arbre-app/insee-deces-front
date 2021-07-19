import { LOADING, SUCCESS, ERROR, CLEAR_SEARCH, LIVE } from './actions';

export const initialState = {
  loading: false,
  form: null,
  liveForm: null,
  data: null,
  warnings: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: true,
        form: state.form,
        liveForm: state.liveForm,
        data: state.data,
        warnings: null,
        error: null,
      };
    case SUCCESS:
      return {
        loading: false,
        form: action.form,
        liveForm: state.liveForm,
        data: action.data,
        warnings: action.warnings,
        error: null,
      };
    case ERROR:
      return {
        loading: false,
        form: state.form,
        liveForm: state.liveForm,
        data: null,
        warnings: null,
        error: action.error,
      };
    case CLEAR_SEARCH:
      return {
        ...initialState,
        form: {
          resultsPerPage: state.resultsPerPage, // Preserve this parameter
        },
      };
    case LIVE:
      return {
        ...state,
        liveForm: action.liveForm,
      };
    default:
      return state;
  }
};
