import { Form, InputGroup } from 'react-bootstrap';
import { FunnelFill } from 'react-bootstrap-icons';

export function SortBySelect() {
  return (
    <>
      <Form.Label htmlFor="sortby" srOnly>
        Événement
      </Form.Label>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FunnelFill className="icon" />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          as="select"
          id="sortby"
          custom
        >
          <option value="birth">Naissance</option>
          <option value="death">Décès</option>
        </Form.Control>
      </InputGroup>
    </>
  );
}