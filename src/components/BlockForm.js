import { Col, Form, Row } from 'react-bootstrap';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_EVENT_TYPE, DEFAULT_ORDER_TYPE } from '../api';
import { DEFAULT_RESULTS_PER_PAGE } from '../config';
import {
  ClearButton,
  DateRangeGroup,
  GivenNameInput,
  SearchButton,
  SearchPlaceInput,
  SortBySelect,
  SortOrderSelect,
  SurnameInput,
} from '../form';
import { DEFAULT_RANGE, DEFAULT_YEAR_PLUS_MINUS } from '../form/DateRangeGroup';
import { extractAndParsePermalink } from '../permalink';
import { prefillForm, setLiveFormData, submitForm } from '../state/form/actions';
import { deepEqual } from '../utils';

export function BlockForm() {
  const dispatch = useDispatch();
  const submitFormDispatch = formData => dispatch(submitForm(formData));
  const onSubmit = (data, e) => {
    submitFormDispatch(data);
  };

  const prefillFormDispatch = partialFormData => dispatch(prefillForm(partialFormData));
  const permalinkData = extractAndParsePermalink();
  if (permalinkData !== null) {
    const [permalinkPartialFormData, permalinkIsStatsTab] = permalinkData;
    prefillFormDispatch(permalinkPartialFormData);
  }

  const setLiveFormDataDispatch = values => dispatch(setLiveFormData(values));
  const formState = useSelector(state => state.form);

  const initialValues = {
    surname: undefined,
    givenName: undefined,
    place: [],
    sortBy: DEFAULT_EVENT_TYPE,
    rangeType: DEFAULT_RANGE,
    yearPlusMinus: String(DEFAULT_YEAR_PLUS_MINUS),
    sortOrder: DEFAULT_ORDER_TYPE,
    resultsPerPage: DEFAULT_RESULTS_PER_PAGE,
  };

  const renderForm = ({ handleSubmit, values }) => {
    const unsubmittable = !values.surname || !values.surname.trim();
    const modified = !deepEqual(values, initialValues, false);

    const formState = useSelector(state => state.form);
    const isLoading = formState.loading;
    const resetable = modified || !!formState.data; // TODO
    return (
      <Form onSubmit={handleSubmit}>
        <FormSpy onChange={state => setLiveFormDataDispatch(state.values)} subscription={{ values: true }} />
        <Row>
          <Col>
            Recherchez instantanément dans la base des décès enregistrés par l'Insee depuis <strong>1970</strong> :
          </Col>
        </Row>
        <Row className="form-row">
          <Col md={3}>
            <SurnameInput disabled={isLoading} />
          </Col>
          <Col md={3}>
            <GivenNameInput disabled={isLoading} />
          </Col>
          <Col md={5} lg={4}>
            <SearchPlaceInput disabled={isLoading} />
          </Col>
          <Col xs={{ order: 2 }} md={{ span: 1, order: 0 }} lg={2}>
            <SearchButton disabled={unsubmittable || isLoading} isLoading={isLoading} />
          </Col>
          <Col md={3} xl={{ offset: 1, span: 2 }}>
            <SortBySelect disabled={isLoading} />
          </Col>
          <Col md={5} lg={4}>
            <DateRangeGroup disabled={isLoading} />
          </Col>
          <Col md={3} xl={2}>
            <SortOrderSelect disabled={isLoading} />
          </Col>
          {resetable && (
            <Col xs={{ order: 1 }} md={1} lg={2} xl={{ offset: 1, span: 2 }}>
              <ClearButton initialValues={initialValues} disabled={isLoading} />
            </Col>
          )}
        </Row>
      </Form>
    );
  };

  return (
    <div className="block block-form">
      <FinalForm
        onSubmit={onSubmit}
        initialValues={formState.liveForm !== null ? formState.liveForm : (permalinkData !== null ? permalinkData[0] : initialValues)}
        render={renderForm}
      />
    </div>
  );
}
