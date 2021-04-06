import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
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

export function BlockForm({ resetable, onReset }) {
  return (
    <div className="block block-form">
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
        <Col xs={{ order: 'last' }} md={{ span: 1, order: 0 }} lg={2}>
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
          <Col md={1} lg={{ offset: 1, span: 2 }}>
            <ClearButton />
          </Col>
        )}
      </Row>
    </div>
  );
}

BlockForm.propTypes = {
  resetable: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
};
