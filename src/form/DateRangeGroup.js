import PropTypes from 'prop-types';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';

export const RANGE_EXACT = "exact";
export const RANGE_BETWEEN = "between";
export const RANGE_AFTER = "after";
export const RANGE_BEFORE = "before";
export const RANGE_ABOUT = "about";

export const DEFAULT_RANGE = RANGE_BETWEEN;
export const DEFAULT_YEAR_PLUS_MINUS = 5;

export function DateRangeGroup({ disabled }) {
  // TODO missing label
  const form = useForm();
  const type = form.getState().values.rangeType;

  return (
    <InputGroup>
      <Field
        name="rangeType"
        render={({ input }) => (
          <Form.Control
            as="select"
            custom
            disabled={disabled}
            {...input}
          >
            <option value={RANGE_EXACT}>En</option>
            <option value={RANGE_BETWEEN}>Entre</option>
            <option value={RANGE_AFTER}>Après</option>
            <option value={RANGE_BEFORE}>Avant</option>
            <option value={RANGE_ABOUT}>Vers</option>
          </Form.Control>
        )}
      />
      {(type === RANGE_EXACT || type === RANGE_ABOUT || type === RANGE_AFTER || type === RANGE_BEFORE) && (
        <Field
          name="year"
          render={({ input }) => (
            <FormControl type="number" placeholder="Année" disabled={disabled} {...input} />
          )}
        />
      )}
      {(type === RANGE_BETWEEN) && (
        <>
          <Field
            name="yearAfter"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" disabled={disabled} {...input} />
            )}
          />
          <Field
            name="yearBefore"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" disabled={disabled} {...input} />
            )}
          />
        </>
      )}
      {type === RANGE_ABOUT && (
        <>
          <div className="input-group-prepend input-group-append">
            <span className="input-group-text user-select-none">
              &plusmn;
            </span>
          </div>
          <Field
            name="yearPlusMinus"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année(s)" min={0} disabled={disabled} {...input} />
            )} />
        </>
      )}
    </InputGroup>
  );
}

DateRangeGroup.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
