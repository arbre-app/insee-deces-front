import PropTypes from 'prop-types';
import { ExclamationCircleFill} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function UserWarningMessage({ warnings }) {
  return (
    <Message variant="warning" icon={ExclamationCircleFill}>
      <FormattedMessage id="result.warning.title" />
      <ul className="mb-0">
        {warnings.map((warning, i) => (
          <li key={i}><FormattedMessage id={`result.warning.item.${warning}`} /></li>
        ))}
      </ul>
    </Message>
  );
}

UserWarningMessage.propTypes = {
  warnings: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
