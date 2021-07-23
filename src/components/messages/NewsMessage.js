import PropTypes from 'prop-types';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { Message } from './Message';

export function NewsMessage({ onClose }) {
  return (
    <Message icon={InfoCircleFill} variant="info" onClose={onClose}>
      L'interface a été entièrement revue et de nouvelles fonctionnalités ont été ajoutées ; n'hésitez pas à nous donner votre retour.
      <br />
      Vous avez toujours la possibilité de revenir à <a href="#">l'ancienne version</a> si vous le désirez.
    </Message>
  );
}

NewsMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
