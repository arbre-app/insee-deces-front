import PropTypes from 'prop-types';
import { ConeStriped} from 'react-bootstrap-icons';
import { Message } from './Message';

export function ServiceUnavailableMessage({ serverMessage }) {
  return (
    <Message variant="warning" icon={ConeStriped}>
      Le service est momentanément indisponible.
      {!!serverMessage && (
        <>
          <br />
          <strong>Motif</strong> : {serverMessage}.
        </>
      )}
    </Message>
  );
}

ServiceUnavailableMessage.propTypes = {
  serverMessage: PropTypes.string,
};

ServiceUnavailableMessage.defaultProps = {
  serverMessage: null,
};
