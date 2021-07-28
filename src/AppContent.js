import PropTypes from 'prop-types';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { BlockForm, BlockInformation, BlockResultTabs, Footer, Header, Messages, SelectLocale } from './components';
import { BlockApi } from './components/BlockApi';
import { extractAndParsePermalink } from './permalink';

const PAGE_MAIN = 'main';
const PAGE_INFORMATIONS = 'infos';
const PAGE_API = 'api';

export function AppContent({ setLocale, legacyUrl }) {
  const permalinkData = extractAndParsePermalink();

  const formState = useSelector(state => state.form);
  const form = formState.form;
  const settingsState = useSelector(state => state.settings);
  const [visiblePage, setVisiblePage] = useState(PAGE_MAIN);
  const [isTabStats, setTabStats] = useState(permalinkData !== null && permalinkData[1]);

  const intl = useIntl();

  return (
    <Container>
      <Helmet>
        <title>
          {(form !== null ? intl.formatMessage({ id: 'meta.title_search'}, { query: [form.surname, form.givenName].map(s => s ? s.trim() : s).filter(s => s).join(' ') }) + ' · ' : '') + intl.formatMessage({ id: 'header.title' })}
        </title>
        <body className={settingsState.data.theme} />
      </Helmet>

      <Container className="position-absolute text-right ml-n3">
        <SelectLocale
          className="mt-2"
          currentLocale={intl.locale}
          setLocale={locale => setLocale && setLocale(locale)}
        />
      </Container>

      <Header />

      {visiblePage === PAGE_MAIN ? (
        <>
          <Messages legacyUrl={legacyUrl} />

          <BlockForm initialPartialData={permalinkData !== null ? permalinkData[0] : null} onClear={() => setTabStats(false)} />

          <BlockResultTabs isTabStats={isTabStats} setTabStats={setTabStats} />
        </>
      ) : visiblePage === PAGE_INFORMATIONS ? (
        <BlockInformation onBackClick={() => setVisiblePage(PAGE_MAIN)} />
      ) : visiblePage === PAGE_API ? (
        <BlockApi onBackClick={() => setVisiblePage(PAGE_MAIN)} />
      ) : null}

      <Footer onInformationClick={() => setVisiblePage(PAGE_INFORMATIONS)} onApiClick={() => setVisiblePage(PAGE_API)} />
    </Container>
  );
}

AppContent.propTypes = {
  setLocale: PropTypes.func,
  legacyUrl: PropTypes.string,
};

AppContent.defaultProps = {
  setLocale: null,
  legacyUrl: null,
};
