import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

export function GivenNameInput({ disabled }) {
  const intl = useIntl();
  return (
    <Field
      name="givenName"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            <FormattedMessage id="form.given_names" />
          </Form.Label>
          <Form.Control
            placeholder={intl.formatMessage({ id: 'form.given_names_placeholder' })}
            disabled={disabled}
            {...input}
          />
        </>
      )}
    />
  );
}

GivenNameInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
