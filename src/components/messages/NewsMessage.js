import { Alert, Col, Row } from 'react-bootstrap';
import { InfoCircleFill } from 'react-bootstrap-icons';

export function NewsMessage() {
  return (
    <Alert variant="info" dismissible>
      <Row>
        <Col xs="x" className="my-auto">
          <InfoCircleFill className="ml-2" style={{ fontSize: '24px' }} />
        </Col>
        <Col>
          L'interface a été entièrement revue et de nouvelles fonctionnalités ont été ajoutées ; n'hésitez pas à nous donner votre retour.
          <br />
          Vous avez toujours la possibilité de revenir à <a href="#">l'ancienne version</a> si vous le désirez.
        </Col>
      </Row>

    </Alert>
  );
}
