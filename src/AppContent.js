import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { BlockForm, BlockInformation, BlockResultTabs, Footer, Header, DisplayMessages } from './components';
import { BlockApi } from './components/BlockApi';
import { extractAndParsePermalink } from './permalink';
import { useFormContext } from './state/form';
import { useSettingsContext } from './state/settings';

const PAGE_MAIN = 'main';
const PAGE_INFORMATIONS = 'infos';
const PAGE_API = 'api';

export function AppContent({ locale, legacyUrl, headerCmp: HeaderCmp, helmetCmp: HelmetCmp }) {
  const [permalinkData, setPermalinkData] = useState(null);
  useEffect(() => {
    setPermalinkData(extractAndParsePermalink());
  }, [setPermalinkData]);

  const { state: { submittedForm: form } } = useFormContext();
  const { state: { data: { theme } } } = useSettingsContext();
  const [visiblePage, setVisiblePage] = useState(PAGE_MAIN);
  const [isTabStats, setTabStats] = useState(false);
  useEffect(() => {
    if(permalinkData !== null && permalinkData[1]) {
      setTabStats(true);
    }
  }, [permalinkData]);

  const intl = useIntl();

  const [focused, setFocused] = useState(true);
  useEffect(() => setFocused(false), []);

  return (
    <Container>
      <HelmetCmp>
        <title>
          {(form !== null ? intl.formatMessage({ id: 'meta.title_search'}, { query: [form.surname, form.givenName].map(s => s ? s.trim() : s).filter(s => s).join(' ') }) + ' · ' : '') + intl.formatMessage({ id: 'header.title' })}
        </title>
        <body className={theme} />
      </HelmetCmp>

      <HeaderCmp />

      <Header />

      {visiblePage === PAGE_MAIN ? (
        <>
          <DisplayMessages legacyUrl={legacyUrl} />

          <BlockForm initialPartialData={permalinkData !== null ? permalinkData[0] : null} setInitialPartialData={() => setPermalinkData(null)} onClear={() => setTabStats(false)} focused={focused} />

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
  legacyUrl: PropTypes.string,
  locale: PropTypes.string.isRequired,
  headerCmp: PropTypes.any.isRequired,
  helmetCmp: PropTypes.any.isRequired,
};

AppContent.defaultProps = {
  legacyUrl: null,
};
