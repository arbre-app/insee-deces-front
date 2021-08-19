import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { AppContent } from './AppContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormProvider } from './state/form';
import { SettingsProvider } from './state/settings';
import './index.css';
import fr from './i18n/fr.json';
import en from './i18n/en.json';

export function App({ locale, setLocale, legacyUrl }) {
  let messages;
  if(locale === 'fr') {
    messages = fr;
  } else if(locale === 'en') {
    messages = en;
  } else {
    throw new Error(locale);
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      <SettingsProvider>
        <FormProvider>
          <AppContent setLocale={setLocale} legacyUrl={legacyUrl} />
        </FormProvider>
      </SettingsProvider>
    </IntlProvider>
  );
}

App.propTypes = {
  locale: PropTypes.string,
  setLocale: PropTypes.func,
  legacyUrl: PropTypes.string,
};

App.defaultProps = {
  locale: 'fr',
  setLocale: null,
  legacyUrl: null,
};
