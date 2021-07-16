import PropTypes from 'prop-types';
import { ExclamationCircleFill} from 'react-bootstrap-icons';
import { Message } from './Message';

export function UserWarningMessage({ warnings }) {
  return (
    <Message variant="warning" icon={ExclamationCircleFill}>
      Votre recherche a produit les avertissements suivants :
      <ul className="mb-0">
        {warnings.map((warning, i) => (
          <li key={i}>{warning}</li>
        ))}
      </ul>
    </Message>
  );
}

UserWarningMessage.propTypes = {
  warnings: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
