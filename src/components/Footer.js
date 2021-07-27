import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { Github, InfoCircleFill, Tools } from 'react-bootstrap-icons';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { DB_LAST_UPDATE, DB_TOTAL_RECORDS } from '../config';
import { InternalLink } from './InternalLink';
import { author, repository } from '../../package.json';

export function Footer({ onInformationClick, onApiClick }) {
  return (
    <>
      <Row className="text-center mt-3">
        <Col xs={12}>
          <FormattedMessage id="footer.current_data" values={{
            count: <strong><FormattedNumber value={DB_TOTAL_RECORDS} /></strong>,
            date: <em><FormattedDate value={DB_LAST_UPDATE} month="long" year="numeric" /></em>,
          }} />
        </Col>
        <Col xs={12}>
          <InternalLink onClick={onInformationClick}>
            <InfoCircleFill className="icon mr-2"/>
            <strong>
              <FormattedMessage id="footer.informations" />
            </strong>
          </InternalLink>
        </Col>
      </Row>
      <hr />
      <Row className="text-center mt-3">
        <Col xs={12}>
          <em>
            <FormattedMessage id="footer.credit" values={{
              author: <a href="https://florian.cassayre.me" target="_blank">{author}</a>,
              a: inseeData => <a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noreferrer">{inseeData}</a>
            }} />
          </em>
        </Col>
        <Col xs={12}>
          <InternalLink onClick={onApiClick}>
            <Tools className="icon mr-2"/>
            <strong>
              <FormattedMessage id="footer.api" />
            </strong>
          </InternalLink>
        </Col>
        <Col xs={12} className="mt-2">
          <a href={repository.url.replace('.git', '')} target="_blank" rel="noreferrer" className="link-dark">
            <Github className="icon h2" />
          </a>
        </Col>
      </Row>
    </>
  );
}

Footer.propTypes = {
  onInformationClick: PropTypes.func.isRequired,
  onApiClick: PropTypes.func.isRequired,
};
