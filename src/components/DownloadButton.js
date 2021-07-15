import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FileEarmarkArrowDownFill } from 'react-bootstrap-icons';

export function DownloadButton({ disabled, ...props }) {
  return (
    <Button variant="secondary" disabled={disabled} {...props}>
      <FileEarmarkArrowDownFill className="icon" />
    </Button>
  );
}

DownloadButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};
