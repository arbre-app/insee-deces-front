import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { ArrowDownUp } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { ORDER_TYPE_ASCENDING, ORDER_TYPE_DESCENDING } from '../api';

export function SortOrderSelect({ disabled }) {
  const intl = useIntl();
  return (
    <Field
      name="sortOrder"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            <FormattedMessage id="form.sort" />
          </Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <ArrowDownUp />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as="select"
              custom
              disabled={disabled}
              {...input}
            >
              <option value={ORDER_TYPE_ASCENDING}>{intl.formatMessage({ id: 'common.sort.ascending' })}</option>
              <option value={ORDER_TYPE_DESCENDING}>{intl.formatMessage({ id: 'common.sort.descending' })}</option>
            </Form.Control>
          </InputGroup>
        </>
      )}
    />
  );
}

SortOrderSelect.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
