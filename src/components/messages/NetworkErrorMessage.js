import { ExclamationTriangleFill} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function NetworkErrorMessage() {
  return (
    <Message variant="danger" icon={ExclamationTriangleFill}>
      <FormattedMessage id="message.network_error" />
    </Message>
  );
}
