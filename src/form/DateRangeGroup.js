import { Form, FormControl, InputGroup } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';

export const RANGE_BETWEEN = "between";
export const RANGE_EXACT = "exact";
export const RANGE_ABOUT = "about";

export function DateRangeGroup() {
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
            {...input}
          >
            <option value={RANGE_BETWEEN}>Entre</option>
            <option value={RANGE_EXACT}>En</option>
            <option value={RANGE_ABOUT}>Vers</option>
          </Form.Control>
        )}
      />
      {type === RANGE_BETWEEN && (
        <>
          <Field
            name="yearAfter"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" {...input} />
            )} />
          <Field
            name="yearBefore"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" {...input} />
            )} />
        </>
      )}
      {type === RANGE_EXACT && (
        <>
          <Field
            name="year"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" {...input} />
            )} />
        </>
      )}
      {type === RANGE_ABOUT && (
        <>
          <Field
            name="year"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année" {...input} />
            )} />
          <div className="input-group-prepend input-group-append">
            <span className="input-group-text user-select-none">
              &plusmn;
            </span>
          </div>
          <Field
            name="yearPlusMinus"
            render={({ input }) => (
              <FormControl type="number" placeholder="Année(s)" {...input} />
            )} />
        </>
      )}
    </InputGroup>
  );
}
