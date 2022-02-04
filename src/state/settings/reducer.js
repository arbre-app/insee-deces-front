import {
  HIDE_MESSAGE_NEWS, RESET, SET_COLUMN_ACT_CODE,
  SET_COLUMN_EVENT_TYPE,
  SET_MATCHES_HIGHLIGHTING,
  SET_THEME, SET_WIKIPEDIA_LINKS,
  THEME_DARK,
  THEME_LIGHT,
} from './actions';

export const defaultState = {
  data: {
    theme: THEME_LIGHT,
    matchesHighlighting: true,
    wikipediaLinks: true,
    messageNewsVisible: true, // Not used anymore
    columnEventType: true,
    columnActCode: false,
  },
};

const LOCAL_STORAGE_KEY = 'settings';

const loadState = () => {
  if(typeof window === 'undefined') {
    return defaultState;
  }
  const storedRawState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(storedRawState !== null) {
    try {
      const data = JSON.parse(storedRawState);
      if(data == null) { // Not allowed
        return defaultState;
      }
      const validateCategory = allowed => (value, defaultValue) => allowed.includes(value) ? value : defaultValue;
      const validateBoolean = (value, defaultValues) => validateCategory([false, true])(value, defaultValues);
      return {
        data: {
          theme: validateCategory([THEME_LIGHT, THEME_DARK])(data.theme, defaultState.data.theme),
          matchesHighlighting: validateBoolean(data.matchesHighlighting, defaultState.data.matchesHighlighting),
          wikipediaLinks: validateBoolean(data.wikipediaLinks, defaultState.data.wikipediaLinks),
          messageNewsVisible: validateBoolean(data.messageNewsVisible, defaultState.data.messageNewsVisible),
          columnEventType: validateBoolean(data.columnEventType, defaultState.data.columnEventType),
          columnActCode: validateBoolean(data.columnActCode, defaultState.data.columnActCode),
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
    case SET_WIKIPEDIA_LINKS:
    case SET_COLUMN_EVENT_TYPE:
    case SET_COLUMN_ACT_CODE:
    case HIDE_MESSAGE_NEWS:
      const merged = {
        data: {
          ...state.data,
          ...action.data,
        },
      };
      saveState(merged); // Persist
      return merged;
    case RESET:
      const newState = defaultState;
      saveState(newState);
      return newState;
    default:
      throw new Error();
  }
};
