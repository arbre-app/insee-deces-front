import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({});

const store = createStore(
  rootReducer,
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
    applyMiddleware(thunk),
  ),
);

export default store;
