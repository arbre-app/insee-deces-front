import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { AppContent } from './AppContent';
import { FormProvider } from './state/form';
import { GedcomProvider } from './state/gedcom';
import { SettingsProvider } from './state/settings';
import fr from './i18n/fr.json';
import en from './i18n/en.json';

export function App({ locale, legacyUrl, headerCmp, helmetCmp }) {
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
          <GedcomProvider>
            <AppContent locale={locale} legacyUrl={legacyUrl} headerCmp={headerCmp} helmetCmp={helmetCmp} />
          </GedcomProvider>
        </FormProvider>
      </SettingsProvider>
    </IntlProvider>
  );
}

App.propTypes = {
  locale: PropTypes.string,
  legacyUrl: PropTypes.string,
  headerCmp: PropTypes.any.isRequired,
  helmetCmp: PropTypes.any.isRequired,
};

App.defaultProps = {
  locale: 'fr',
  legacyUrl: null,
};
