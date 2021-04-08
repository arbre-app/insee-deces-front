import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormattedNumber } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setResultsPerPage } from '../state/form/actions';

export function ResultsPerPageSelect({ values, ...props }) {
  const formState = useSelector(state => state.form);
  const dispatch = useDispatch();
  const setCurrentPageDispatch = currentPage => dispatch(setResultsPerPage(currentPage));
  const value = formState.form.resultsPerPage;
  return (
    <Dropdown className="results-per-page-select" {...props}>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        {value}
      </Dropdown.Toggle>
      <Dropdown.Menu className="width-min">
        {values.map(size => (
          <Dropdown.Item key={size} active={size === value} onClick={() => setCurrentPageDispatch(size)}><FormattedNumber value={size} /></Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}