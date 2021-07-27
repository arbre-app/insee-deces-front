import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

export function GivenNameInput({ disabled }) {
  return (
    <Field
      name="givenName"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            <FormattedMessage id="form.given_names" />
          </Form.Label>
          <Form.Control
            placeholder="Prénoms(s)"
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
