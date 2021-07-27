import PropTypes from 'prop-types';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

export const RANGE_EXACT = "exact";
export const RANGE_BETWEEN = "between";
export const RANGE_AFTER = "after";
export const RANGE_BEFORE = "before";
export const RANGE_ABOUT = "about";

export const DEFAULT_RANGE = RANGE_BETWEEN;
export const DEFAULT_YEAR_PLUS_MINUS = 5;

export function DateRangeGroup({ disabled }) {
  // TODO missing label
  const intl = useIntl();
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
            <option value={RANGE_EXACT}>{intl.formatMessage({ id: 'form.period.exact' })}</option>
            <option value={RANGE_BETWEEN}>{intl.formatMessage({ id: 'form.period.between' })}</option>
            <option value={RANGE_AFTER}>{intl.formatMessage({ id: 'form.period.after' })}</option>
            <option value={RANGE_BEFORE}>{intl.formatMessage({ id: 'form.period.before' })}</option>
            <option value={RANGE_ABOUT}>{intl.formatMessage({ id: 'form.period.about' })}</option>
          </Form.Control>
        )}
      />
      {(type === RANGE_EXACT || type === RANGE_ABOUT || type === RANGE_AFTER || type === RANGE_BEFORE) && (
        <Field
          name="year"
          render={({ input }) => (
            <FormControl type="number" placeholder={intl.formatMessage({ id: 'form.year' })} disabled={disabled} {...input} />
          )}
        />
      )}
      {(type === RANGE_BETWEEN) && (
        <>
          <Field
            name="yearAfter"
            render={({ input }) => (
              <FormControl type="number" placeholder={intl.formatMessage({ id: 'form.year' })} disabled={disabled} {...input} />
            )}
          />
          <Field
            name="yearBefore"
            render={({ input }) => (
              <FormControl type="number" placeholder={intl.formatMessage({ id: 'form.year' })} disabled={disabled} {...input} />
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
              <FormControl type="number" placeholder={intl.formatMessage({ id: 'form.years_amount' })} min={0} disabled={disabled} {...input} />
            )} />
        </>
      )}
    </InputGroup>
  );
}

DateRangeGroup.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
