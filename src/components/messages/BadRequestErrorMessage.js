import PropTypes from 'prop-types';
import { ExclamationTriangleFill} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function BadRequestErrorMessage({ onClose }) {
  return (
    <Message variant="danger" icon={ExclamationTriangleFill} onClose={onClose}>
      <FormattedMessage id="message.bad_request_error" />
    </Message>
  );
}

BadRequestErrorMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
