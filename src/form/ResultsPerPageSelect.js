import { Dropdown } from 'react-bootstrap';

export function ResultsPerPageSelect({ values }) {
  return (
    <Dropdown className="results-per-page-select">
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        Placeholder
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {values.map(size => (
          <Dropdown.Item href="#">{size}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
