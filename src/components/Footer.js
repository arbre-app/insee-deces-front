import PropTypes from 'prop-types';
import { useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { EnvelopeFill, Github, InfoCircleFill, Tools } from 'react-bootstrap-icons';
import { FormattedDate, FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { CONTACT_EMAIL, DB_LAST_UPDATE, DB_TOTAL_RECORDS } from '../config';
import { InlineCopy } from './InlineCopy';
import { InternalLink } from './InternalLink';
import pkg from '../../package.json';

export function Footer({ onInformationClick, onApiClick }) {
  const intl = useIntl();
  const [show, setShow] = useState(false);

  const handleModalInformationClick = () => {
    setShow(false);
    onInformationClick();
  };

  const renderModal = () => (
    <Modal show={show} onHide={() => setShow(false)} restoreFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title><FormattedMessage id="footer.contact" /></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <FormattedMessage id="footer.contact_remark" values={{ b: remark => <strong>{remark}</strong>, a: text => <InternalLink onClick={handleModalInformationClick}>{text}</InternalLink> }} />
        </p>
        <Row>
          <Col xs={12} sm={{ offset: 3, span: 6 }}>
            <InlineCopy id="input-contact" text={CONTACT_EMAIL} center />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );

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
              author: <a href="https://florian.cassayre.me" target="_blank" rel="noopener">{pkg.author}</a>,
              a: inseeData => <a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noreferrer">{inseeData}</a>
            }} />
          </em>
        </Col>
        <Col xs={12}>
          <InternalLink onClick={() => setShow(true)} noScroll>
            <EnvelopeFill className="icon mr-2" />
            <strong>
              <FormattedMessage id="footer.contact" />
            </strong>
          </InternalLink>
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
          <a href={pkg.repository.url.replace('.git', '')} target="_blank" rel="noreferrer" className="link-dark" aria-label={intl.formatMessage({ id: 'footer.github' })}>
            <Github className="icon h2" />
          </a>
        </Col>
      </Row>
      {renderModal()}
    </>
  );
}

Footer.propTypes = {
  onInformationClick: PropTypes.func.isRequired,
  onApiClick: PropTypes.func.isRequired,
};
