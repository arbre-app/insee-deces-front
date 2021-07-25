import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BlockForm, BlockInformation, BlockResultTabs, Footer, Header, Messages, SelectLanguage } from './components';
import { BlockApi } from './components/BlockApi';
import { extractAndParsePermalink } from './permalink';

const PAGE_MAIN = 'main';
const PAGE_INFORMATIONS = 'infos';
const PAGE_API = 'api';

function App() {

  const permalinkData = extractAndParsePermalink();

  const settingsState = useSelector(state => state.settings);
  const [visiblePage, setVisiblePage] = useState(PAGE_MAIN);
  const [isTabStats, setTabStats] = useState(permalinkData !== null && permalinkData[1]);

  return (
    <Container>
      <Helmet>
        <body className={settingsState.data.theme} />
      </Helmet>

      <Container className="position-absolute text-right ml-n3">
        <SelectLanguage
          className="mt-2"
          currentLanguage="fr"
          setLanguage={() => {}}
        />
      </Container>

      <Header />

      {visiblePage === PAGE_MAIN ? (
        <>
          <Messages />

          <BlockForm initialPartialData={permalinkData !== null ? permalinkData[0] : null} />

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

export default App;
