import PropTypes from 'prop-types';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Message } from './Message';

export function NewsMessage({ onClose }) {
  return (
    <Message icon={InfoCircleFill} variant="info" onClose={onClose}>
      <FormattedMessage id="message.news" values={{ br: () => <br />, a: legacyPage => <a href="#">{legacyPage}</a> }} />
    </Message>
  );
}

NewsMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};
