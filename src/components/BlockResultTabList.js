import { Col, Row } from 'react-bootstrap';
import { RESULTS_PER_PAGE } from '../config';
import { ResultsPerPageSelect } from '../form';
import { AdvancedConfigurationButton } from './AdvancedConfigurationButton';
import { DownloadButton } from './DownloadButton';
import { PermalinkButton } from './PermalinkButton';
import { ResultListTable } from './ResultListTable';
import { SmallPagination } from './SmallPagination';

export function BlockResultTabList() {
  return (
    <div className="block block-tab block-tab-results pb-1">
      <Row>
        <Col>
          <PermalinkButton url={"abcdef"} />
          <DownloadButton />
        </Col>
        <Col className="text-right">
          <strong>XXX résultats</strong>{' '}
          &middot;
          Page x sur X
          &middot;
          Résultats par page :{' '}
          <ResultsPerPageSelect values={RESULTS_PER_PAGE} />
          <AdvancedConfigurationButton />
        </Col>
      </Row>
      <ResultListTable results={[]} />
      <SmallPagination currentPage={1} totalPages={100} />
    </div>
  );
}
