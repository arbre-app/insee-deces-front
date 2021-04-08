import { Col, Row } from 'react-bootstrap';
import { Github, InfoCircleFill } from 'react-bootstrap-icons';
import { FormattedDate, FormattedNumber } from 'react-intl';
import { DB_LAST_UPDATE, DB_TOTAL_RECORDS } from '../config';

export function Footer() {
  return (
    <>
      <Row className="text-center mt-3">
        <Col xs={12}>
          La base contient <strong><FormattedNumber value={DB_TOTAL_RECORDS} /></strong> fiches (<em><FormattedDate value={DB_LAST_UPDATE} month="long" year="numeric" /></em>)
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
            Réalisé et hébergé par <a href="https://florian.cassayre.me" target="_blank">Florian Cassayre</a> à partir des <a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noreferrer">données de l'Insee</a>, sans en être affilié.
          </em>
        </Col>
        <Col xs={12} className="mt-2">
          <a href="https://github.com/arbre-app/insee-deces-front" rel="noreferrer" className="link-dark">
            <Github className="icon h2" />
          </a>
        </Col>
      </Row>
    </>
  );
}