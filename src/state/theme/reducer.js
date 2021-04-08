import { SET_THEME } from './action';
import { THEME_LIGHT } from '../../components/AdvancedConfigurationButton';

export const initialState = {
  data: {
    theme: THEME_LIGHT,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        data: action.data,
      };
    default:
      return state;
  }
};
