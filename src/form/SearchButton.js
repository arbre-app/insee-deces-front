import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export function SearchButton({ disabled }) {
  return (
    <Button disabled={disabled} className="width-max">
      <Search className="icon" />
      <span className="ml-2 d-inline d-md-none d-lg-inline">
        Rechercher
      </span>
    </Button>
  );
}

SearchButton.propTypes = {
  disabled: PropTypes.bool,
};

SearchButton.defaultProps = {
  disabled: false,
};
