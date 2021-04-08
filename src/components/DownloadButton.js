import { Button } from 'react-bootstrap';
import { FileEarmarkArrowDownFill } from 'react-bootstrap-icons';

export function DownloadButton({ ...props }) {
  return (
    <Button variant="secondary" {...props}>
      <FileEarmarkArrowDownFill className="icon" />
    </Button>
  );
}
