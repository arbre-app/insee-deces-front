import PropTypes from 'prop-types';
import { Button} from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import React, { useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { getPlaces } from '../api';
import { tokenizeAndNormalizeText } from '../utils';

export function SearchPlaceInput({ disabled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const refQuery = useRef();
  refQuery.current = query;
  const refLoading = useRef();
  refLoading.current = [isLoading, setIsLoading];

  const handleSearch = (currentQuery) => {
    setQuery(currentQuery);

    getPlaces(10, currentQuery)
      .then(({ results }) => { // TODO handle errors
        const query = refQuery.current;
        const [isLoading, setIsLoading] = refLoading.current;
        if(query.startsWith(currentQuery)) {
          setOptions(results);
        }
        if(isLoading) {
          setIsLoading(query !== currentQuery);
        }
      });
  };

  const filterBy = () => true;

  return (
    <>
      <Field
        name="place"
        render={({ input: { name, value, onChange } }) =>
          editing && !disabled ? (
            <AsyncTypeahead
              filterBy={filterBy}
              id={name}
              isLoading={false} /* Fix */
              labelKey="fullname"
              minLength={1}
              onSearch={handleSearch}
              options={options} /*.filter(({ fullname }) => tokenizeAndNormalizeText(fullname).join('').startsWith(tokenizeAndNormalizeText(query).join('')))}*/
              placeholder="Lieu (commune, département, région ou pays)"
              emptyLabel="Aucun lieu trouvé."
              promptText="Entrez un lieu..."
              searchText="Recherche en cours..."
              autoFocus
              highlightOnlyResult
              onBlur={() => {
                setEditing(false);
              }}
              onChange={value => {
                onChange(value);
                setOptions(value);
                if(value.length) {
                  setEditing(false);
                  setQuery(value[0].fullname);
                }
              }}
              onKeyDown={e => {
                const value = e.target.value;
                if(value !== query) {
                  setQuery(value);
                  setIsLoading(true);
                }
              }}
              selected={value}
              renderMenuItemChildren={(option, props) => (
                <>
                  <span className={isLoading ? 'text-muted' : null}>{option.fullname}</span>
                </>
              )}
            />
          ) : (
            <Button variant="light" className="text-left width-max text-nowrap overflow-hidden" onClick={() => setEditing(true)} disabled={disabled}>
              {value.length ? value[0].fullname : <span className="text-muted">Lieu (commune, département, région ou pays)</span>}
            </Button>
          )
        }
      />
    </>
  );
}

SearchPlaceInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
