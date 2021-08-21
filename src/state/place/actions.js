import { getPlaces } from '../../api';

export const LOADING = 'place/LOADING';
export const SUCCESS = 'place/SUCCESS';
export const ERROR = 'place/ERROR';

export const searchAutocomplete = query => async (dispatch, getState) => {
  if(getState().query !== query) {
    dispatch({
      type: LOADING,
      query,
    });

    if(query.trim().length === 0) {
      dispatch({
        type: SUCCESS,
        data: null,
      });
    } else {
      const isBoundToQuery = () => getState().query === query;

      try {
        const result = await getPlaces(10, query);
        if(isBoundToQuery()) {
          dispatch({
            type: SUCCESS,
            data: result,
          });
        }
      } catch (error) { // Handle errors as if the whole transaction failed (atomicity)
        console.error(error);
        if(isBoundToQuery()) {
          dispatch({
            type: ERROR,
            error: error,
          });
        }
      }
    }
  }
};
