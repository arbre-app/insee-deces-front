import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

export function SurnameInput({ disabled }) {
  const intl = useIntl();
  return (
    <Field
      name="surname"
      validate={value => value && !value.trim()}
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            <FormattedMessage id="form.surnames" />
          </Form.Label>
          <Form.Control
            required
            placeholder={intl.formatMessage({ id: 'form.surnames_placeholder' })}
            disabled={disabled}
            autoFocus
            {...input}
          />
        </>
      )}
    />
  );
}

SurnameInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
