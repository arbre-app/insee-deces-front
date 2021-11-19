import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { INPUT_MAX_LENGTH } from '../config';

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
            maxLength={INPUT_MAX_LENGTH}
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
