import PropTypes from 'prop-types';
import { Alert, Col, Row } from 'react-bootstrap';

export function Message({ onClose, variant, icon, children }) {
  const IconCmp = icon;
  return (
    <Alert variant={variant} dismissible onClose={onClose}>
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
  onClose: PropTypes.func,
  variant: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  children: PropTypes.any,
};

Message.defaultProps = {
  onClose: null,
  children: null,
};
