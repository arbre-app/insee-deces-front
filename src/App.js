import { Container} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BlockForm, BlockResultTabs, Footer, Header } from './components';
import { NewsMessage } from './components/messages';

function App() {

  const themeState = useSelector(state => state.theme);

  return (
    <Container>
      <Helmet>
        <body className={themeState.data.theme} />
      </Helmet>

      <Header />

      <NewsMessage />

      <BlockForm />

      <BlockResultTabs />

      <Footer />
    </Container>
  );
}

export default App;
