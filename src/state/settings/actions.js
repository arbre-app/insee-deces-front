export const SET_THEME = 'settings/SET_THEME';
export const SET_MATCHES_HIGHLIGHTING = 'settings/SET_MATCHES_HIGHLIGHTING';
export const SET_WIKIPEDIA_LINKS = 'settings/SET_WIKIPEDIA_LINKS';
export const SET_COLUMN_EVENT_TYPE = 'settings/SET_COLUMN_EVENT_TYPE';
export const SET_COLUMN_ACT_CODE = 'settings/SET_COLUMN_ACT_CODE';
export const HIDE_MESSAGE_NEWS = 'settings/HIDE_MESSAGE_NEWS';
export const RESET = 'settings/RESET';

export const THEME_LIGHT = 'theme-light';
export const THEME_DARK = 'theme-dark';

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

export const setWikipediaLinks = isEnabled => async dispatch => {
  dispatch({
    type: SET_WIKIPEDIA_LINKS,
    data: {
      wikipediaLinks: isEnabled,
    }
  });
};

export const setColumnEventType = isEnabled => async dispatch => {
  dispatch({
    type: SET_COLUMN_EVENT_TYPE,
    data: {
      columnEventType: isEnabled,
    }
  });
};

export const setColumnActCode = isEnabled => async dispatch => {
  dispatch({
    type: SET_COLUMN_ACT_CODE,
    data: {
      columnActCode: isEnabled,
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

export const resetSettings = () => async dispatch => {
  dispatch({
    type: RESET,
  });
};
