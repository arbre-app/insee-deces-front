import { Col, Container, Row } from 'react-bootstrap';
import { Book, Github, InfoCircleFill } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet';
import { BlockForm, BlockResultTabs } from './components';
import { NewsMessage } from './components/messages';
import { DB_LAST_UPDATE, DB_TOTAL_RECORDS } from './config';

function App() {
  const theme = 'theme-light';
  return (
    <Container>
      <Helmet>
        <body className={theme} />
      </Helmet>

      <div className="text-center mt-4">
        <h1>
          <Book className="icon" />
        </h1>
        <h4>Fichier des décès de l'Insee</h4>
      </div>

      <NewsMessage />

      <BlockForm resetable={false} onReset={() => 0}/>

      <BlockResultTabs />

      <Row className="text-center mt-3">
        <Col xs={12}>
          La base contient <strong>{DB_TOTAL_RECORDS}</strong> fiches (<em>{DB_LAST_UPDATE}</em>)
        </Col>
        <Col xs={12}>
          <a href="#">
            <InfoCircleFill className="icon mr-2"/>
            <strong>
              Informations
            </strong>
          </a>
        </Col>
      </Row>
      <hr />
      <Row className="text-center mt-3">
        <Col xs={12}>
          <em>
            Réalisé et hébergé par <a href="https://florian.cassayre.me" target="_blank">Florian Cassayre</a> à partir des <a href="#" target="_blank" rel="noreferrer">données de l'Insee</a>, sans en être affilié.
          </em>
        </Col>
        <Col xs={12} className="mt-2">
          <a href="#" rel="noreferrer" className="link-dark">
            <Github className="icon h2" />
          </a>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
