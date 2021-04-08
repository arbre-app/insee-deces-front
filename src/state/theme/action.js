export const SET_THEME = 'theme/SET_THEME';

export const setTheme = theme => async dispatch => {
  dispatch({
    type: SET_THEME,
    data: {
      theme: theme,
    },
  });
};
