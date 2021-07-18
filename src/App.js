import { useState } from 'react';
import { Container} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BlockForm, BlockInformation, BlockResultTabs, Footer, Header, Messages } from './components';

function App() {

  const settingsState = useSelector(state => state.settings);
  const [isInformationVisible, setInformationVisible] = useState(false);

  return (
    <Container>
      <Helmet>
        <body className={settingsState.data.theme} />
      </Helmet>

      <Header />

      {isInformationVisible ? (
        <BlockInformation onBackClick={() => setInformationVisible(false)} />
      ) : (
        <>
          <Messages />

          <BlockForm />

          <BlockResultTabs />
        </>
      )}

      <Footer onInformationClick={() => setInformationVisible(true)} />
    </Container>
  );
}

export default App;
