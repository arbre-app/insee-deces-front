import { Form } from 'react-bootstrap';
import { Field, useForm } from 'react-final-form';

export function GivenNameInput(props) {
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
            {...props}
            {...input}
          />
        </>
      )}
    />
  );
}
