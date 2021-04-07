import { Col, Row } from 'react-bootstrap';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';
import { RESULTS_PER_PAGE } from '../config';
import { ResultsPerPageSelect } from '../form';
import { AdvancedConfigurationButton } from './AdvancedConfigurationButton';
import { DownloadButton } from './DownloadButton';
import { PermalinkButton } from './PermalinkButton';
import { ResultListTable } from './ResultListTable';
import { SmallPagination } from './SmallPagination';

export function BlockResultTabList() {
  const formState = useSelector(state => state.form);
  const data = formState.data, formData = formState.form;
  const totalPages = Math.ceil(data.count / formData.resultsPerPage);
  return (
    <div className="block block-tab block-tab-results pb-1">
      <Row className="px-2">
        <Col sm={3}>
          <PermalinkButton url={"abcdef"} />
          <DownloadButton />
        </Col>
        <Col sm={9} className="text-right">
          <strong><FormattedNumber value={data.count} /> résultats</strong>{' '}
          &middot;
          Page <FormattedNumber value={formData.currentPage} /> sur <FormattedNumber value={totalPages} />{' '}
          &middot;
          Résultats par page :{' '}
          <ResultsPerPageSelect values={RESULTS_PER_PAGE} />
          <AdvancedConfigurationButton />
        </Col>
      </Row>
      <ResultListTable results={data.results} />
      <SmallPagination currentPage={formData.currentPage} totalPages={totalPages} />
    </div>
  );
}
