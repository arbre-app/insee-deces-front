import { ExclamationTriangleFill} from 'react-bootstrap-icons';
import { Message } from './Message';

export function NetworkErrorMessage() {
  return (
    <Message variant="danger" icon={ExclamationTriangleFill}>
      La connexion au serveur n'a pas pu être établie.
      Vérifiez votre connectivité à internet ou bien réessayez dans quelques instants.
    </Message>
  );
}
