import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { AppContent } from './AppContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import './index.css';
import fr from './i18n/fr.json';
import en from './i18n/en.json';

function App({ locale, setLocale }) {
  let messages;
  if(locale === 'fr') {
    messages = fr;
  } else if(locale === 'en') {
    messages = en;
  } else {
    throw new Error(locale);
  }

  return (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <AppContent setLocale={setLocale} />
      </IntlProvider>
    </Provider>
  );
}

App.propTypes = {
  locale: PropTypes.string,
  setLocale: PropTypes.func,
};

App.defaultProps = {
  locale: 'fr',
  setLocale: null,
};

export default App;
