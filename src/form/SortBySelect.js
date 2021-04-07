import { Form, InputGroup } from 'react-bootstrap';
import { FunnelFill } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { EVENT_TYPE_BIRTH, EVENT_TYPE_DEATH } from '../api';

export function SortBySelect() {
  return (
    <Field
      name="sortBy"
      render={({ input }) => (
        <>
          <Form.Label htmlFor={input.name} srOnly>
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
              custom
              {...input}
            >
              <option value={EVENT_TYPE_BIRTH}>Naissance</option>
              <option value={EVENT_TYPE_DEATH}>Décès</option>
            </Form.Control>
          </InputGroup>
        </>
      )}
    />
  );
}
