import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlaceProvider, searchAutocomplete, usePlaceContext } from '../state/place';

function SearchPlaceField({ value, onChange, disabled }) {
  useEffect(() => {
    if(value.length > 0) {
      const fullname = value[0].fullname;
      setQuery(fullname);
      searchAutocompleteDispatch(fullname);
    }
  }, [value]);
  const { state: { loading, data, error }, dispatch: dispatchPlace } = usePlaceContext();
  const searchAutocompleteDispatch = query => dispatchPlace(searchAutocomplete(query));

  const intl = useIntl();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const clearQuery = () => {
    setQuery('');
    searchAutocompleteDispatch('');
  };
  const handleClear = () => {
    clearQuery();
    focusInput();
  };
  const handleToggle = (isOpen, e, { source }) => {
    setOpen(isOpen);
    if(open) {
      if(data !== null && data.results.length === 1) {
        handleSelect(data.results[0]);
      } else if(source !== 'select') {
        clearQuery();
        onChange([]);
      }
    } else if(value.length > 0) {
      setQuery(value[0].fullname);
    } else {
      clearQuery();
    }
  };
  const handleChange = e => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    searchAutocompleteDispatch(newQuery);
  };
  const handleKeyPress = e => {
    if(e.charCode === 13) { // Enter key (normal *and* numpad)
      if(data !== null && data.results.length > 0) {
        handleSelect(data.results[0]);
        e.preventDefault();
      }
    }
  };
  const handleSelect = place => {
    onChange([place]);
    setQuery(place.fullname);
    searchAutocompleteDispatch(place.fullname);
  };
  const hasData = data !== null && data.results.length > 0;

  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();

  useEffect(() => {
    if(open) {
      focusInput();
    }
  }, [open]);

  return (
    <Dropdown onToggle={handleToggle}>
      <Dropdown.Toggle variant="light" disabled={disabled} id="place-dropdown" className="text-left btn-block text-nowrap overflow-hidden">
        {value.length > 0 ? value[0].fullname : (
          <FormattedMessage id="form.place" />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu show={open} style={{ minWidth: '100%' }}>
        <InputGroup className="mx-3 my-1 w-auto">
          <FormControl
            ref={inputRef}
            aria-describedby="basic-addon1"
            placeholder={intl.formatMessage({ id: 'form.enter_place' })}
            onChange={handleChange}
            value={query}
            onKeyPress={handleKeyPress}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" disabled={!query} onClick={handleClear}><XLg /></Button>
          </InputGroup.Append>
        </InputGroup>
        {loading && !hasData ? ( // Loading
          <div className="text-center mt-3 mb-1">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : hasData ? ( // Results
          <div className="mt-3">
            {data.results.map((place) => (
              <Dropdown.Item
                key={place.id}
                disabled={loading}
                onClick={() => handleSelect(place)}
                active={data.results.length === 1}
              >{place.fullname}</Dropdown.Item>
            ))}
          </div>
        ) : error === null ? (
          query.trim().length === 0 ? // Nothing typed
            null
            : ( // No result
              <div className="mt-2">
                <Dropdown.Header><FormattedMessage id="form.no_place_found" /></Dropdown.Header>
              </div>
          )
        ) : ( // Error
          <div className="mt-2">
            <Dropdown.Header><FormattedMessage id="form.place_error" /></Dropdown.Header>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

SearchPlaceField.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export function SearchPlaceInput({ disabled }) {
  return (
    <>
      <Field
        name="place"
        render={({ input: { value, onChange } }) => (
          <PlaceProvider>
            <SearchPlaceField value={value} onChange={onChange} disabled={disabled} />
          </PlaceProvider>
        )}
      />
    </>
  );
}

SearchPlaceInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
