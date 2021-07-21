import { useState } from 'react';
import { Container} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BlockForm, BlockInformation, BlockResultTabs, Footer, Header, Messages } from './components';
import { BlockApi } from './components/BlockApi';

const PAGE_MAIN = 'main';
const PAGE_INFORMATIONS = 'infos';
const PAGE_API = 'api';

function App() {

  const settingsState = useSelector(state => state.settings);
  const [visiblePage, setVisiblePage] = useState(PAGE_MAIN);
  const [isTabStats, setTabStats] = useState(false);

  return (
    <Container>
      <Helmet>
        <body className={settingsState.data.theme} />
      </Helmet>

      <Header />

      {visiblePage === PAGE_MAIN ? (
        <>
          <Messages />

          <BlockForm />

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
