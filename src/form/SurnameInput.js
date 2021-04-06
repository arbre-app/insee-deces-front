import { Form } from 'react-bootstrap';

export function SurnameInput(props) {
  return (
    <>
      <Form.Label htmlFor="surname" srOnly>
        Nom(s) de famille
      </Form.Label>
      <Form.Control
        id="surname"
        required
        placeholder="Nom(s) (requis)"
        {...props}
      />
    </>
  );
}
