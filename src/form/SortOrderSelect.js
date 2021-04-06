import { Form, InputGroup } from 'react-bootstrap';
import { ArrowDownUp } from 'react-bootstrap-icons';

export function SortOrderSelect() {
  return (
    <>
      <Form.Label htmlFor="sortorder" srOnly>
        Tri
      </Form.Label>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <ArrowDownUp />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          as="select"
          id="sortorder"
          custom
        >
          <option value="ascending">Croissant</option>
          <option value="descending">Décroissant</option>
        </Form.Control>
      </InputGroup>
    </>
  );
}