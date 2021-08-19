import { HIDE_MESSAGE_NEWS, SET_MATCHES_HIGHLIGHTING, SET_THEME, THEME_DARK, THEME_LIGHT } from './actions';

export const defaultState = {
  data: {
    theme: THEME_LIGHT,
    matchesHighlighting: true,
    messageNewsVisible: true,
  },
};

const LOCAL_STORAGE_KEY = 'settings';

const loadState = () => {
  const storedRawState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(storedRawState !== null) {
    try {
      const data = JSON.parse(storedRawState);
      if(data == null) { // Not allowed
        return defaultState;
      }
      const validateCategory = allowed => (value, defaultValue) => allowed.includes(value) ? value : defaultValue;
      const categoryBooleans = [false, true];
      return {
        data: {
          theme: validateCategory([THEME_LIGHT, THEME_DARK])(data.theme, defaultState.data.theme),
          matchesHighlighting: validateCategory(categoryBooleans)(data.matchesHighlighting, defaultState.data.matchesHighlighting),
          messageNewsVisible: validateCategory(categoryBooleans)(data.messageNewsVisible, defaultState.data.messageNewsVisible),
        }
      };
    } catch(e) { // Invalid configuration format (?)
      console.error(e);
      return defaultState;
    }
  } else { // No configuration stored
    return defaultState;
  }
};

const saveState = state => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.data));
};

export const initialState = loadState();


export const settingsReducer = (state, action) => {
  switch (action.type) {
    case SET_THEME:
    case SET_MATCHES_HIGHLIGHTING:
    case HIDE_MESSAGE_NEWS:
      const merged = {
        data: {
          ...state.data,
          ...action.data,
        },
        bla: 'abc',
      };
      saveState(merged); // Persist
      return merged;
    default:
      throw new Error();
  }
};
