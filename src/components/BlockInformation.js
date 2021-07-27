import PropTypes from 'prop-types';
import {
  ArrowRightShort,
  ExclamationTriangle,
  QuestionCircle,
  Search,
  Shield,
} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { BackButton } from './BackButton';

export function BlockInformation({ onBackClick }) {
  return (
    <div className="block">
      <BackButton onClick={onBackClick} />
      <div className="my-2">
        <h3><FormattedMessage id="info.title" /></h3>
        <h5>
          <ExclamationTriangle className="icon mr-2" />
          <FormattedMessage id="info.important_remarks.title" />
        </h5>
        <p>
          <FormattedMessage id="info.important_remarks.content" values={{
            a: inseeData => <a href="https://www.insee.fr/fr/information/4190491" target="_blank" rel="noreferrer">{inseeData}</a>,
            b: noGuarantees => <strong>{noGuarantees}</strong>,
            year: 1970,
          }} />
        </p>
        <h5>
          <Search className="icon mr-2" />
          <FormattedMessage id="info.search_parameters.title" />
        </h5>
        <ul>
          <li>
            <FormattedMessage id="info.search_parameters.list_separator" values={{
              title: <strong><FormattedMessage id="info.search_parameters.names.title" /></strong>,
              description: <FormattedMessage id="info.search_parameters.names.description" />
            }} />
          </li>
          <li>
            <FormattedMessage id="info.search_parameters.list_separator" values={{
              title: <strong><FormattedMessage id="info.search_parameters.places.title" /></strong>,
              description: <FormattedMessage id="info.search_parameters.places.description" />
            }} />
          </li>
          <li>
            <FormattedMessage id="info.search_parameters.list_separator" values={{
              title: <strong><FormattedMessage id="info.search_parameters.dates.title" /></strong>,
              description: <FormattedMessage id="info.search_parameters.dates.description" />
            }} />
          </li>
        </ul>
        <h5>
          <Shield className="icon mr-2" />
          <FormattedMessage id="info.confidentiality.title" />
        </h5>
        <p>
          <FormattedMessage id="info.confidentiality.content" />
        </p>
        <h5>
          <QuestionCircle className="icon mr-2" />
          <FormattedMessage id="info.faq.title" />
        </h5>
        <h6><FormattedMessage id="info.faq.cannot_find.question" /></h6>
        <p>
          <ArrowRightShort className="icon mr-1" />
          <FormattedMessage id="info.faq.cannot_find.answer" />
        </p>
        <h6><FormattedMessage id="info.faq.found_error.question" /></h6>
        <p>
          <ArrowRightShort className="icon mr-1" />
          <FormattedMessage id="info.faq.found_error.answer" />
        </p>
        <h6>
          <FormattedMessage id="info.faq.removal.question" />
        </h6>
        <p>
          <ArrowRightShort className="icon mr-1" />
          <FormattedMessage id="info.faq.removal.answer" values={{
            a: legal => <a href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000034708124/2019-12-31/" target="_blank" rel="noreferrer">{legal}</a>,
            i: citation => <em>{citation}</em>
          }} />
        </p>
      </div>
      <BackButton onClick={onBackClick} />
    </div>
  );
}

BlockInformation.propTypes = {
  onBackClick: PropTypes.func.isRequired,
};
