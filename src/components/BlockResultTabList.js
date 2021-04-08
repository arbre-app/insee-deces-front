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
import { SmallPagination } from './SmallPagination';

export function BlockResultTabList() {
  const formState = useSelector(state => state.form);
  const dispatch = useDispatch();
  const setCurrentPageDispatch = currentPage => dispatch(setCurrentPage(currentPage));
  const data = formState.data, formData = formState.form;
  const totalPages = Math.ceil(data.count / formData.resultsPerPage);
  return (
    <div className="block block-tab block-tab-results pb-1 pt-2">
      <Row className="px-2">
        <Col sm={3}>
          <PermalinkButton url={"abcdef"} className="mr-2" />
          <DownloadButton />
        </Col>
        <Col sm={9} className="text-right">
          <strong><FormattedNumber value={data.count} /> résultats</strong>{' '}
          &middot;
          Page <FormattedNumber value={formData.currentPage} /> sur <FormattedNumber value={Math.max(totalPages, 1)} />{' '}
          &middot;
          Résultats par page :{' '}
          <ResultsPerPageSelect values={RESULTS_PER_PAGE} />
          <AdvancedConfigurationButton className="ml-2" />
        </Col>
      </Row>
      {data.count > 0 ? (
        <>
          <ResultListTable results={data.results} />
          <SmallPagination currentPage={formData.currentPage} totalPages={totalPages} onChange={setCurrentPageDispatch} />
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
