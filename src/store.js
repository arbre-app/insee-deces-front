import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import formReducer from './state/reducer';

const rootReducer = combineReducers({
  form: formReducer,
});

const store = createStore(
  rootReducer,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(thunk),
  ),
);

export default store;
