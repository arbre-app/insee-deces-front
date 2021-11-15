import PropTypes from 'prop-types';
import { ExclamationTriangleFill} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function NetworkErrorMessage({ onClose }) {
  return (
    <Message variant="danger" icon={ExclamationTriangleFill} onClose={onClose}>
      <FormattedMessage id="message.network_error" />
    </Message>
  );
}

NetworkErrorMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
