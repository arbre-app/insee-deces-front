import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import formReducer from './state/form/reducer';
import settingsReducer from './state/settings/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  settings: settingsReducer,
});

const store = createStore(
  rootReducer,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(thunk),
  ),
);

export default store;
