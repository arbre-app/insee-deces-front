import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form';

export function SurnameInput(props) {
  return (
    <Field
      name="surname"
      validate={value => value && !value.trim()}
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
            Nom(s) de famille
          </Form.Label>
          <Form.Control
            required
            placeholder="Nom(s) (requis)"
            {...props}
            {...input}
          />
        </>
      )}
    />
  );
}
