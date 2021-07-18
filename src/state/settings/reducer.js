import { SET_MATCHES_HIGHLIGHTING, SET_THEME } from './action';
import { THEME_LIGHT } from '../../components/AdvancedConfigurationButton';

export const initialState = {
  data: {
    theme: THEME_LIGHT,
    matchesHighlighting: true,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
    case SET_MATCHES_HIGHLIGHTING:
      return {
        data: {
          ...state.data,
          ...action.data,
        },
      };
    default:
      return state;
  }
};
