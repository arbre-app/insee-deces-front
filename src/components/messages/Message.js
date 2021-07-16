import PropTypes from 'prop-types';
import { Alert, Col, Row } from 'react-bootstrap';

export function Message({ variant, icon, children }) {
  const IconCmp = icon;
  return (
    <Alert variant={variant} dismissible>
      <Row>
        <Col xs="x" className="my-auto">
          <IconCmp className="ml-2" style={{ fontSize: '24px' }} />
        </Col>
        <Col>
          {children}
        </Col>
      </Row>
    </Alert>
  );
}

Message.propTypes = {
  variant: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};
