import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';

export function GivenNameInput({ disabled }) {
  return (
    <Field
      name="givenName"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            Prénom(s)
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
