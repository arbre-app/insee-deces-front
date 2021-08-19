import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormattedNumber } from 'react-intl';
import { setResultsPerPage, useFormContext } from '../state/form';

export function ResultsPerPageSelect({ values, disabled, ...props }) {
  const { state: { form }, dispatch: dispatchForm } = useFormContext();
  const setCurrentPageDispatch = currentPage => dispatchForm(setResultsPerPage(currentPage));
  const value = form.resultsPerPage;
  return (
    <Dropdown className="results-per-page-select" {...props}>
      <Dropdown.Toggle variant="light" id="dropdown-basic" disabled={disabled}>
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

ResultsPerPageSelect.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  disabled: PropTypes.bool.isRequired,
};
