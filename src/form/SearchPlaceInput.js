import { Button} from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import React, { useState } from "react";
import { Field } from 'react-final-form';
import { getPlaces } from '../api';

export function SearchPlaceInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (currentQuery) => {
    setIsLoading(true);
    setQuery(currentQuery);

    getPlaces(10, currentQuery)
      .then(({ results }) => {
        setQuery(q => {
          if(q.startsWith(currentQuery)) {
            setOptions(results);
            setIsLoading(false);
          }
          return q;
        });
      });
  };

  const filterBy = () => true;

  return (
    <>
      <Field
        name="place"
        render={({ input: { name, value, onChange } }) =>
          editing ? (
            <AsyncTypeahead
              filterBy={filterBy}
              id={name}
              isLoading={false} /* Fix */
              labelKey="fullname"
              minLength={1}
              onSearch={handleSearch}
              options={options}
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
            <Button variant="light" className="text-left width-max text-nowrap overflow-hidden" onClick={() => setEditing(true)}>
              {value.length ? value[0].fullname : <span className="text-muted">Lieu (commune, département, région ou pays)</span>}
            </Button>
          )
        }
      />
    </>
  );
}
