import { Form, FormControl, InputGroup } from 'react-bootstrap';

export function DateRangeGroup() {
  return (
    <InputGroup>
      <Form.Control
        as="select"
        id="periodtype"
        custom
      >
        <option value="between">Entre</option>
        <option value="in">En</option>
        <option value="ca">Vers</option>
      </Form.Control>
      <FormControl type="number" aria-describedby="periodstart" />
      <FormControl type="number" aria-describedby="periodend" />
    </InputGroup>
  );
}
