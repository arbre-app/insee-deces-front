import { Col, Form, Row } from 'react-bootstrap';
import { Form as FinalForm, useForm } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { EVENT_TYPE_BIRTH, ORDER_TYPE_ASCENDING } from '../api';
import { RESULTS_PER_PAGE } from '../config';
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
import { RANGE_BETWEEN } from '../form/DateRangeGroup';
import { submitForm } from '../state/form/actions';
import { deepEqual } from '../utils';

export function BlockForm() {
  const dispatch = useDispatch();
  const submitFormDispatch = formData => dispatch(submitForm(formData));
  const onSubmit = (data, e) => {
    submitFormDispatch(data);
  };

  const renderForm = ({ handleSubmit, values, initialValues }) => {
    const unsubmittable = !values.surname || !values.surname.trim();
    const modified = !deepEqual(values, initialValues);

    const formState = useSelector(state => state.form);
    const isLoading = formState.loading;
    const resetable = modified || !!formState.data; // TODO
    return (
      <Form onSubmit={handleSubmit}>
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
            <SearchButton disabled={unsubmittable || isLoading} />
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
              <ClearButton disabled={isLoading} />
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
        initialValues={{ surname: '', givenName: '', place: [], sortBy: EVENT_TYPE_BIRTH, rangeType: RANGE_BETWEEN, yearPlusMinus: 5, sortOrder: ORDER_TYPE_ASCENDING, resultsPerPage: RESULTS_PER_PAGE[0] }}
        render={renderForm}
      />
    </div>
  );
}
