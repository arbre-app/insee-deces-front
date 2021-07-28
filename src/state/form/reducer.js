import {
  LOADING,
  SUCCESS,
  ERROR,
  CLEAR_SEARCH,
  LIVE,
  RESULT_STATS_GEOGRAPHY,
  RESULT_STATS_TIME,
  CLEAR_WARNING,
} from './actions';

const initialStateStats = {
  loading: false,
  data: null,
};

export const initialState = {
  loading: false,
  form: null,
  submittedForm: null,
  liveForm: null,
  data: null,
  statsGeography: initialStateStats,
  statsTime: initialStateStats,
  warnings: null,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: true,
        form: state.form,
        submittedForm: action.form,
        liveForm: action.form, // The sender can request the form data to change
        data: state.data,
        statsGeography: {
          loading: true,
          data: state.statsGeography !== null ? state.statsGeography.data : null,
        },
        statsTime: {
          loading: true,
          data: state.statsTime !== null ? state.statsTime.data : null,
        },
        warnings: null,
        error: null,
      };
    case SUCCESS:
      return {
        loading: false,
        form: action.form,
        submittedForm: state.submittedForm,
        liveForm: state.liveForm,
        data: action.data,
        statsGeography: state.statsGeography,
        statsTime: state.statsTime,
        warnings: action.warnings,
        error: null,
      };
    case RESULT_STATS_GEOGRAPHY:
      return {
        ...state,
        statsGeography: action.form === state.submittedForm ? { loading: false, data: action.statsGeography } : state.statsGeography,
      };
    case RESULT_STATS_TIME:
      return {
        ...state,
        statsTime: action.form === state.submittedForm ? { loading: false, data: action.statsTime } : state.statsTime,
      };
    case ERROR:
      return {
        loading: false,
        form: state.form,
        submittedForm: state.submittedForm,
        liveForm: state.liveForm,
        data: null,
        statsGeography: state.statsGeography,
        statsTime: state.statsTime,
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
    case CLEAR_WARNING:
      return {
        ...state,
        warnings: null,
      };
    default:
      return state;
  }
};
