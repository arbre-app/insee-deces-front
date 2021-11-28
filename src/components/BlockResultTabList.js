import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { RESULTS_PER_PAGE } from '../config';
import { ResultsPerPageSelect } from '../form';
import { setCurrentPage, useFormContext } from '../state/form';
import { useSettingsContext } from '../state/settings';
import { SettingsButton } from './SettingsButton';
import { DownloadButton } from './DownloadButton';
import { PermalinkButton } from './PermalinkButton';
import { ResultListTable } from './ResultListTable';
import { SmallPagination } from '../form/SmallPagination';

export function BlockResultTabList() {
  const { state: { data, form, loading }, dispatch: dispatchForm } = useFormContext();
  const { state: { data: { matchesHighlighting, wikipediaLinks, columnEventType, columnActCode } } } = useSettingsContext();
  const setCurrentPageDispatch = currentPage => dispatchForm(setCurrentPage(currentPage));
  const handlePageChange = newPage => {
    setCurrentPageDispatch(newPage);
    window.scrollTo({ // TODO increase the speed of the animation (too slow!)
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const renderCounts = className => (
    <span className={(loading ? 'group-disabled' : '') + ' ' + className}>
      <strong><FormattedMessage id="result.n_results" values={{ results: <FormattedNumber value={data.count} />, n: data.count }} /></strong>{' '}
      &middot;{' '}
      <FormattedMessage id="result.page_of" values={{
        current: <FormattedNumber value={form.currentPage} />,
        total: <FormattedNumber value={Math.max(totalPages, 1)} />
      }} />
      {' '}
      <span className="d-none d-md-inline">
        &middot;{' '}
        <FormattedMessage id="result.results_per_page" />{' '}
      </span>
    </span>
  );
  const totalPages = Math.ceil(data.count / form.resultsPerPage);
  return (
    <div className="block block-tab block-tab-results pb-1 pt-2">
      <Row className="px-2">
        <Col xs={6} sm={3} md={2} className="pr-0">
          <PermalinkButton disabled={loading} className="mr-2" />
          <DownloadButton disabled={loading || data.count === 0} />
        </Col>
        <Col xs={6} sm={9} md={10} className="text-right pl-0">
          {renderCounts('d-none d-sm-inline')}
          <ResultsPerPageSelect values={RESULTS_PER_PAGE} disabled={loading} />
          <SettingsButton className="ml-2" />
        </Col>
      </Row>
      <Row>
        <Col className="px-4 mt-2 m-sm-0 text-right">{renderCounts('d-sm-none')}</Col>
      </Row>
      {data.count > 0 ? (
        <>
          <ResultListTable results={data.results} formData={form} disabled={loading} withHighlights={matchesHighlighting} withLinks={wikipediaLinks} columnEventType={columnEventType} columnActCode={columnActCode} />
          <SmallPagination currentPage={form.currentPage} totalPages={totalPages} onChange={handlePageChange} disabled={loading} />
        </>
      ) : (
        <div className="text-center mt-2">
          <h5><FormattedMessage id="result.no_result.title" /></h5>
          <p className="text-muted">
            <FormattedMessage id="result.no_result.description" />
          </p>
        </div>
      )}
    </div>
  );
}
