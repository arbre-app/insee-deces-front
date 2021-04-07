import { Col, Form, Row } from 'react-bootstrap';
import { Form as FinalForm } from 'react-final-form';
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
import { submitForm } from '../state/actions';

export function BlockForm() {
  const form = useSelector(state => state.form);
  const dispatch = useDispatch();
  const submitFormDispatch = formData => dispatch(submitForm(formData));
  const onSubmit = data => {
    console.log(data);
    submitFormDispatch(data);
  };
  const resetable = true; // TODO
  return (
    <div className="block block-form">
      <FinalForm
        onSubmit={onSubmit}
        initialValues={{ surname: '', givenName: '', placeId: [], sortBy: EVENT_TYPE_BIRTH, rangeType: RANGE_BETWEEN, yearPlusMinus: 5, sortOrder: ORDER_TYPE_ASCENDING, resultsPerPage: RESULTS_PER_PAGE[0] }}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                Recherchez instantanément dans la base des décès enregistrés par l'Insee depuis <strong>1970</strong> :
              </Col>
            </Row>
            <Row className="form-row">
              <Col md={3}>
                <SurnameInput />
              </Col>
              <Col md={3}>
                <GivenNameInput />
              </Col>
              <Col md={5} lg={4}>
                <SearchPlaceInput />
              </Col>
              <Col xs={{ order: 2 }} md={{ span: 1, order: 0 }} lg={2}>
                <SearchButton />
              </Col>
              <Col md={3} xl={{ offset: 1, span: 2 }}>
                <SortBySelect />
              </Col>
              <Col md={5} lg={4}>
                <DateRangeGroup />
              </Col>
              <Col md={3} xl={2}>
                <SortOrderSelect />
              </Col>
              {resetable && (
                <Col xs={{ order: 1 }} md={1} lg={2} xl={{ offset: 1, span: 2 }}>
                  <ClearButton />
                </Col>
              )}
            </Row>
          </Form>
        )}
      />
    </div>
  );
}
