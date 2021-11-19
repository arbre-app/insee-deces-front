import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { INPUT_MAX_LENGTH } from '../config';

export function SurnameInput({ disabled, focused }) {
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
            maxLength={INPUT_MAX_LENGTH}
            autoFocus={focused}
            {...input}
          />
        </>
      )}
    />
  );
}

SurnameInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  focused: PropTypes.bool.isRequired,
};
