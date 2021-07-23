export const SET_THEME = 'settings/SET_THEME';
export const SET_MATCHES_HIGHLIGHTING = 'settings/SET_MATCHES_HIGHLIGHTING';
export const HIDE_MESSAGE_NEWS = 'settings/HIDE_MESSAGE_NEWS';

export const setTheme = theme => async dispatch => {
  dispatch({
    type: SET_THEME,
    data: {
      theme: theme,
    },
  });
};

export const setMatchesHighlighting = isEnabled => async dispatch => {
  dispatch({
    type: SET_MATCHES_HIGHLIGHTING,
    data: {
      matchesHighlighting: isEnabled,
    }
  });
};

export const hideNewsMessage = () => async dispatch => {
  dispatch({
    type: HIDE_MESSAGE_NEWS,
    data: {
      messageNewsVisible: false,
    },
  });
};
