import { Form } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import React, { useEffect, useState } from "react";

const SEARCH_URI = 'https://api.github.com/search/users';

export function SearchPlaceInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleSearch = (query) => {
    setIsLoading(true);

    fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
      .then((resp) => resp.json())
      .then(({ items }) => {
        const options = items.map((i) => ({
          avatar_url: i.avatar_url,
          id: i.id,
          login: i.login,
        }));

        setOptions(options);
        setIsLoading(false);
      });
  };

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      allowNew={false}
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="login"
      minLength={3}
      onSearch={handleSearch}
      options={options}
      placeholder="Search for a Github user..."
      onBlur={e => {
        console.log(selected, options);
        /*if(!selected.length) {
          setSelected([]);
        }*/
      }}
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
        <Form.Control
          id="givenn"
          placeholder="Prénoms(s)"
          {...inputProps}
          ref={(input) => {
            // Be sure to correctly handle these refs. In many cases, both can simply receive
            // the underlying input node, but `referenceElementRef can receive a wrapper node if
            // your custom input is more complex (See TypeaheadInputMulti for an example).
            inputRef(input);
            referenceElementRef(input);
          }}
        />
      )}
      onChange={setSelected}
      selected={selected}
      renderMenuItemChildren={(option, props) => (
        <>
          <img
            alt={option.login}
            src={option.avatar_url}
            style={{
              height: '24px',
              marginRight: '10px',
              width: '24px',
            }}
          />
          <span>{option.login}</span>
        </>
      )}
    />
  );
}
