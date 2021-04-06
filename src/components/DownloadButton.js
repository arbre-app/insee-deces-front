import { Button } from 'react-bootstrap';
import { FileEarmarkArrowDownFill } from 'react-bootstrap-icons';

export function DownloadButton() {
  return (
    <Button variant="secondary">
      <FileEarmarkArrowDownFill className="icon" />
    </Button>
  );
}
