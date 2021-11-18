import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
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
import { prefillForm, setLiveFormData, submitForm, useFormContext } from '../state/form';
import { deepEqual } from '../utils';

export function BlockForm({ initialPartialData, setInitialPartialData, onClear, focused }) {
  const { state: formState, dispatch: dispatchForm } = useFormContext();
  const submitFormDispatch = formData => dispatchForm(submitForm(formData));
  const onSubmit = (data, e) => {
    submitFormDispatch(data);
  };

  const prefillFormDispatch = partialFormData => dispatchForm(prefillForm(partialFormData));
  useEffect(() => {
    if(initialPartialData !== null) {
      prefillFormDispatch(initialPartialData);
      setInitialPartialData(null);
    }
  }, [initialPartialData]);

  const setLiveFormDataDispatch = values => dispatchForm(setLiveFormData(values));

  const [initialChange, setInitialChange] = useState(false);
  useEffect(() => {
    setInitialChange(true);
  }, []);
  const handleFormChange = state => {
    // Prevent a warning
    if(initialChange) {
      setInitialChange(true);
      setLiveFormDataDispatch(state.values);
    }
  };

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

    const isLoading = formState.loading;
    const resettable = modified || !!formState.data; // TODO
    return (
      <Form onSubmit={handleSubmit}>
        <FormSpy onChange={handleFormChange} subscription={{ values: true }} />
        <Row>
          <Col>
            <FormattedMessage id="form.description" values={{ year: <strong>1970</strong> }} />
          </Col>
        </Row>
        <Row className="form-row">
          <Col md={3}>
            <SurnameInput disabled={isLoading} focused={focused} />
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
          {resettable && (
            <Col xs={{ order: 1 }} md={1} lg={2} xl={{ offset: 1, span: 2 }}>
              <ClearButton initialValues={initialValues} disabled={isLoading} onClick={onClear} />
            </Col>
          )}
        </Row>
      </Form>
    );
  };

  return (
    <div className="block block-tab">
      <FinalForm
        onSubmit={onSubmit}
        initialValues={formState.liveForm !== null ? formState.liveForm : (initialPartialData !== null ? initialPartialData : initialValues)}
        render={renderForm}
      />
    </div>
  );
}

BlockForm.propTypes = {
  initialPartialData: PropTypes.object,
  setInitialPartialData: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
};

BlockForm.defaultProps = {
  initialPartialData: null,
};
