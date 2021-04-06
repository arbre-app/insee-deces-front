import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import store from './store';

ReactDOM.render(
  //<React.StrictMode>
  <Provider store={store}>
    <IntlProvider locale="fr">
      <App />
    </IntlProvider>
  </Provider>,
  //</React.StrictMode>,
  document.getElementById('root'),
);
