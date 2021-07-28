import {
  EVENT_TYPE_BIRTH,
  EVENT_TYPE_DEATH,
  getPlaces,
  getStatisticsGeography,
  getStatisticsTime,
} from '../../api';
import { extractPeriodFromData, getPersonsFromFormData } from '../../form';

export const LOADING = 'form/LOADING';
export const SUCCESS = 'form/SUCCESS';
export const RESULT_STATS_GEOGRAPHY = 'form/RESULT_STATS_GEOGRAPHY';
export const RESULT_STATS_TIME = 'form/RESULT_STATS_TIME';
export const ERROR = 'form/ERROR';
export const CLEAR_SEARCH = 'form/CLEAR_SEARCH';
export const LIVE = 'form/LIVE';
export const CLEAR_WARNING = 'form/CLEAR_WARNING';

const listWarnings = (form, result) => {
  const MIN_YEAR_BIRTH = 1850;
  const MIN_YEAR_DEATH = 1970;
  const maxYear = new Date().getFullYear(); // eg. 2021

  const [yearAfter, yearBefore] = extractPeriodFromData(form);

  const warnings = [];
  if (yearAfter !== null && yearBefore !== null) {
    if (yearAfter > yearBefore) {
      warnings.push('invalid_period');
    }
  }
  if (yearAfter !== null && yearAfter > maxYear) {
    warnings.push('period_late');
  }
  if (form.sortBy === EVENT_TYPE_DEATH && yearBefore < MIN_YEAR_DEATH) {
    warnings.push('period_early_death');
  }
  if (form.sortBy === EVENT_TYPE_BIRTH && yearBefore < MIN_YEAR_BIRTH) {
    warnings.push('period_early');
  }
  const rSpecialCharacters = /\s|[-,;:._()/+"']/;
  const strings = [form.surname, form.givenName];
  if (strings.some(s => s && Array.from(s).some(c => c.toLowerCase() === c.toUpperCase() && !rSpecialCharacters.test(c)))) {
    warnings.push('special_symbols');
  }
  return warnings;
};

const triggerUpdate = async (dispatch, newData) => {
  let data = newData;
  dispatch({
    type: LOADING,
    form: data,
  });

  if(data.place.length > 0 && data.place[0].id === undefined) { // Need to resolve the id
    let result;
    try {
      result = await getPlaces(1, data.place[0].fullname);
    } catch (error) { // Handle errors as if the whole transaction failed (atomicity)
      console.error(error);
      dispatch({
        type: ERROR,
        error: error,
      });
      return;
    }
    if(result.results.length > 0 && result.results[0].fullname === data.place[0].fullname) { // All good
      data = {
        ...data,
        place: [result.results[0]],
      };
    } else { // Place not found, shouldn't happen unless the URL was tampered. We decide to remove the place in this case
      data = {
        ...data,
        place: [],
      };
    }
    // Use this action to update the data
    dispatch({
      type: LOADING,
      form: data,
    });
  }

  getStatisticsGeography(data.surname, data.givenName)
    .then(result =>
      dispatch({
        type: RESULT_STATS_GEOGRAPHY,
        form: data,
        statsGeography: result,
      })
    )
    .catch(error =>
      dispatch({
        type: RESULT_STATS_GEOGRAPHY,
        form: data,
        statsGeography: null,
      })
    );

  getStatisticsTime(data.surname, data.givenName, data.place.length ? data.place[0].id : undefined, data.sortBy)
    .then(result =>
      dispatch({
        type: RESULT_STATS_TIME,
        form: data,
        statsTime: result,
      })
    )
    .catch(error =>
      dispatch({
        type: RESULT_STATS_TIME,
        form: data,
        statsTime: null,
      })
    );

  let result;
  try {
    result = await getPersonsFromFormData(data);
  } catch (error) {
    console.error(error);
    dispatch({
      type: ERROR,
      error: error,
    });
    return;
  }
  const warnings = listWarnings(data, result);
  dispatch({
    type: SUCCESS,
    form: data,
    data: result,
    warnings: warnings,
  });
};

export const submitForm = formData => async (dispatch, getState) => {
  await triggerUpdate(dispatch, {
    ...formData,
    currentPage: 1,
  });
};

export const setCurrentPage = currentPage => async (dispatch, getState) => {
  await triggerUpdate(dispatch, {
    ...getState().form.form,
    currentPage: currentPage,
  });
};

export const setResultsPerPage = resultsPerPage => async (dispatch, getState) => {
  await triggerUpdate(dispatch, {
    ...getState().form.form,
    currentPage: 1,
    resultsPerPage: resultsPerPage,
  });
};

export const clearForm = () => async dispatch => {
  dispatch({
    type: CLEAR_SEARCH,
  });
};

export const prefillForm = partialFormData => async (dispatch, getState) => {
  await triggerUpdate(dispatch, partialFormData);
};

export const setLiveFormData = values => async dispatch => {
  dispatch({
    type: LIVE,
    liveForm: values,
  });
};

export const clearWarning = () => async dispatch => {
  dispatch({
    type: CLEAR_WARNING,
  });
};
