import { Col, Row } from 'react-bootstrap';
import { FormattedNumber } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { RESULTS_PER_PAGE } from '../config';
import { ResultsPerPageSelect } from '../form';
import { setCurrentPage} from '../state/form/actions';
import { AdvancedConfigurationButton } from './AdvancedConfigurationButton';
import { DownloadButton } from './DownloadButton';
import { PermalinkButton } from './PermalinkButton';
import { ResultListTable } from './ResultListTable';
import { SmallPagination } from '../form/SmallPagination';

export function BlockResultTabList() {
  const formState = useSelector(state => state.form);
  const settingsState = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const setCurrentPageDispatch = currentPage => dispatch(setCurrentPage(currentPage));
  const handlePageChange = newPage => {
    setCurrentPageDispatch(newPage);
    window.scrollTo({ // TODO increase the speed of the animation (too slow!)
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const data = formState.data, formData = formState.form;
  const totalPages = Math.ceil(data.count / formData.resultsPerPage);
  const isLoading = formState.loading;
  return (
    <div className="block block-tab block-tab-results pb-1 pt-2">
      <Row className="px-2">
        <Col sm={3}>
          <PermalinkButton disabled={isLoading} className="mr-2" />
          <DownloadButton disabled={isLoading} />
        </Col>
        <Col sm={9} className="text-right">
          <strong><FormattedNumber value={data.count} /> résultats</strong>{' '}
          &middot;
          Page <FormattedNumber value={formData.currentPage} /> sur <FormattedNumber value={Math.max(totalPages, 1)} />{' '}
          &middot;
          Résultats par page :{' '}
          <ResultsPerPageSelect values={RESULTS_PER_PAGE} disabled={isLoading} />
          <AdvancedConfigurationButton className="ml-2" />
        </Col>
      </Row>
      {data.count > 0 ? (
        <>
          <ResultListTable results={data.results} formData={formData} withHighlights={settingsState.data.matchesHighlighting} />
          <SmallPagination currentPage={formData.currentPage} totalPages={totalPages} onChange={handlePageChange} disabled={isLoading} />
        </>
      ) : (
        <div className="text-center mt-2">
          <h5>Aucun résultat</h5>
          <p className="text-muted">
            Essayez d'élargir vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
}
