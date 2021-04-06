import { Form } from 'react-bootstrap';

export function GivenNameInput(props) {
  return (
    <>
      <Form.Label htmlFor="given" srOnly>
        Prénom(s)
      </Form.Label>
      <Form.Control
        id="given"
        placeholder="Prénoms(s)"
        {...props}
      />
    </>
  );
}
