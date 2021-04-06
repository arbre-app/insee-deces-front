import { Button } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';

export function AdvancedConfigurationButton() {
  return (
    <Button variant="secondary">
      <GearFill className="icon" />
    </Button>
  );
}
