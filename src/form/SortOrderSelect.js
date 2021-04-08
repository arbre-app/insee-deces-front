import { Form, InputGroup } from 'react-bootstrap';
import { ArrowDownUp } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { ORDER_TYPE_ASCENDING, ORDER_TYPE_DESCENDING } from '../api';

export function SortOrderSelect() {
  return (
    <Field
      name="sortOrder"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
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
              custom
              {...input}
            >
              <option value={ORDER_TYPE_ASCENDING}>Croissant</option>
              <option value={ORDER_TYPE_DESCENDING}>Décroissant</option>
            </Form.Control>
          </InputGroup>
        </>
      )}
    />
  );
}