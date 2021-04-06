import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { ArrowCounterclockwise} from 'react-bootstrap-icons';

export function ClearButton({ disabled }) {
  return (
    <Button variant="light" disabled={disabled} className="width-max">
      <ArrowCounterclockwise className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
        Réinitialiser
      </span>
    </Button>
  );
}

ClearButton.propTypes = {
  disabled: PropTypes.bool,
};

ClearButton.defaultProps = {
  disabled: false,
};
