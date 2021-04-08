import { getPersons } from '../../api';
import { RANGE_ABOUT, RANGE_BETWEEN, RANGE_EXACT } from '../../form/DateRangeGroup';

export const LOADING = 'form/LOADING';
export const SUCCESS = 'form/SUCCESS';
export const ERROR = 'form/ERROR';
export const CLEAR_SEARCH = 'form/CLEAR_SEARCH';

const triggerUpdate = async (dispatch, getState, newData) => {
  const { form: oldData } = getState().form;
  const data = {
    ...oldData,
    ...newData,
  };
  dispatch({
    type: LOADING,
  });
  let yearAfter = '', yearBefore = '';
  if(data.rangeType === RANGE_BETWEEN) {
    yearAfter = data.yearAfter;
    yearBefore = data.yearBefore;
  } else if(data.rangeType === RANGE_EXACT) {
    yearAfter = data.year;
    yearBefore = data.year;
  } else if(data.rangeType === RANGE_ABOUT) {
    const pm = data.yearPlusMinus || 5;
    if(data.year) {
      yearAfter = data.year - pm;
      yearBefore = data.year + pm;
    }
  } else {
    throw new Error(data.rangeType);
  }

  let result;
  try {
    result = await getPersons(
      data.currentPage - 1,
      data.resultsPerPage,
      data.surname,
      data.givenName,
      data.place.length ? data.place[0].id : '',
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
  dispatch({
    type: SUCCESS,
    form: data,
    data: result,
  });
};

export const submitForm = formData => async (dispatch, getState) => {
  await triggerUpdate(dispatch, getState, {
    ...formData,
    currentPage: 1,
  });
};

export const setCurrentPage = currentPage => async (dispatch, getState) => {
  await triggerUpdate(dispatch, getState, {
    currentPage: currentPage,
  });
};

export const setResultsPerPage = resultsPerPage => async (dispatch, getState) => {
  await triggerUpdate(dispatch, getState, {
    resultsPerPage: resultsPerPage,
  });
};

export const clearForm = () => async dispatch => {
  dispatch({
    type: CLEAR_SEARCH,
  });
};
