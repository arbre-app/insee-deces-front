import PropTypes from 'prop-types';
import { ConeStriped} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function ServiceUnavailableMessage({ onClose, serverMessage }) {
  return (
    <Message variant="warning" icon={ConeStriped} onClose={onClose}>
      <FormattedMessage id="message.service_unavailable" />
      {!!serverMessage && (
        <>
          <br />
          <FormattedMessage id="message.service_unavailable_reason" values={{ b: reason => <strong>{reason}</strong>, reason: serverMessage }} />
        </>
      )}
    </Message>
  );
}

ServiceUnavailableMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
  serverMessage: PropTypes.string,
};

ServiceUnavailableMessage.defaultProps = {
  serverMessage: null,
};
