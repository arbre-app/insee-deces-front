import { EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH, getPersons, getStatisticsGeography, getStatisticsTime } from '../../api';
import { RANGE_ABOUT, RANGE_AFTER, RANGE_BEFORE, RANGE_BETWEEN, RANGE_EXACT } from '../../form/DateRangeGroup';

export const LOADING = 'form/LOADING';
export const SUCCESS = 'form/SUCCESS';
export const RESULT_STATS_GEOGRAPHY = 'form/RESULT_STATS_GEOGRAPHY';
export const RESULT_STATS_TIME = 'form/RESULT_STATS_TIME';
export const ERROR = 'form/ERROR';
export const CLEAR_SEARCH = 'form/CLEAR_SEARCH';
export const LIVE = 'form/LIVE';

const listWarnings = (form, { yearAfter, yearBefore }, result) => {
  const MIN_YEAR_BIRTH = 1850;
  const MIN_YEAR_DEATH = 1970;
  const maxYear = new Date().getFullYear(); // eg. 2021

  const warnings = [];
  if (yearAfter !== null && yearBefore !== null) {
    if (yearAfter > yearBefore) {
      warnings.push('La période est invalide, l\'année de début devrait être inférieure ou égale à l\'année de fin');
    }
  }
  if (yearAfter !== null && yearAfter > maxYear) {
    warnings.push('L\'année est trop avancée');
  }
  if (form.sortBy === EVENT_TYPE_DEATH && yearBefore < MIN_YEAR_DEATH) {
    warnings.push('L\'année est trop reculée, seuls les décès après 1970 sont consultables');
  }
  if (form.sortBy === EVENT_TYPE_BIRTH && yearBefore < MIN_YEAR_BIRTH) {
    warnings.push('L\'année est trop reculée');
  }
  const rSpecialCharacters = /\s|[-,;:._()/+"']/;
  const strings = [form.surname, form.givenName];
  if (strings.some(s => s && Array.from(s).some(c => c.toLowerCase() === c.toUpperCase() && !rSpecialCharacters.test(c)))) {
    warnings.push('La recherche contient des caractères spéciaux qui ont été ignorés');
  }
  return warnings;
};

const triggerUpdate = async (dispatch, newData) => {
  const data = newData;
  dispatch({
    type: LOADING,
    form: data,
  });
  let yearAfter = undefined, yearBefore = undefined;
  if(data.rangeType === RANGE_BETWEEN) {
    yearAfter = data.yearAfter;
    yearBefore = data.yearBefore;
  } else if(data.rangeType === RANGE_AFTER) {
    yearAfter = data.year;
  } else if(data.rangeType === RANGE_BEFORE) {
    yearBefore = data.year;
  } else if(data.rangeType === RANGE_EXACT) {
    yearAfter = data.year;
    yearBefore = data.year;
  } else if(data.rangeType === RANGE_ABOUT) {
    const pm = parseInt(data.yearPlusMinus || 5);
    if(data.year) {
      const year = parseInt(data.year);
      yearAfter = year - pm;
      yearBefore = year + pm;
    }
  } else {
    throw new Error(data.rangeType);
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
    result = await getPersons(
      (data.currentPage - 1) * data.resultsPerPage,
      data.resultsPerPage,
      data.surname,
      data.givenName || undefined,
      data.place.length ? data.place[0].id : undefined,
      data.sortBy,
      yearAfter,
      yearBefore,
      data.sortOrder,
    );
  } catch (error) {
    console.error(error);
    dispatch({
      type: ERROR,
      error: error,
    });
    return;
  }
  const warnings = listWarnings(data, { yearAfter, yearBefore }, result);
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
  // TODO partial place.fullname
  await triggerUpdate(dispatch, partialFormData);
};

export const setLiveFormData = values => async dispatch => {
  dispatch({
    type: LIVE,
    liveForm: values,
  });
};
